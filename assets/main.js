function json_dumps(json_data){
	return JSON.stringify(json_data, null, '  ').replace('[\n', '').replace('[', '').replace(']', '').replace(/"/g, '').replace(/,/g, '').replace(/,/g, '').replace(/{/g, '').replace(/}/g, '')
}

function json_item(cart_item){
	var info = 'Información:\n' + JSON.stringify(cart_item.data_json, null, '  ').replace('[\n', '').replace('[', '').replace(']', '').replace(/"/g, '').replace(/,/g, '').replace(/,/g, '').replace(/{\n/g, '').replace(/}/g, '')
	var filenames = [];
	if (cart_item.files_json) {
		Object.keys(cart_item.files_json).forEach(function(key) {
			filenames.push(cart_item.files_json[key]['filename']);
		});
		info += '\nArchivos:\n' + JSON.stringify(filenames, null, '  ').replace('[\n', '').replace('[', '').replace(']', '').replace(/"/g, '').replace(/,/g, '').replace(/,/g, '').replace(/{\n/g, '').replace(/}/g, '')
	}
	if ($.isEmptyObject(cart_item.info_json) != true) {
		info += '\nPedido:\n' + JSON.stringify(cart_item.info_json, null, '  ').replace('[\n', '').replace('[', '').replace(']', '').replace(/"/g, '').replace(/,/g, '').replace(/,/g, '').replace(/{\n/g, '').replace(/}/g, '')
	}
	return info
}

function json_order_item(cart_item){
	var info = ''
	if ($.isEmptyObject(cart_item.info_json) != true) {
		info += 'Pedido:\n' + JSON.stringify(cart_item.info_json, null, '  ').replace('[\n', '').replace('[', '').replace(']', '').replace(/"/g, '').replace(/,/g, '').replace(/,/g, '').replace(/{\n/g, '').replace(/}/g, '')
	}
	return info
}

function decodePayload(payload){
	var decodedData = JSON.parse(payload);
	return decodedData
}

function encodePayload(payload){
	var encodedData = JSON.stringify(payload);
	return encodedData
}

function create_submit_form(method,payload,files){
	var form_data = new FormData();
	form_data.append('method',method);
	form_data.append('session',getCookie('session_token'));
	form_data.append('payload',encodePayload(payload));
	if (files) {
		var upload_file;
		for (var i = 0; i < files.length; i++) {
			upload_file = files[i];
			form_data.append('file',upload_file,upload_file.name);
		}
	}
	return form_data
}

function remoteCall(method,payload,files){

	var callback = $.Deferred();
	var form_data = create_submit_form(method,payload,files);
	if (data_jekyll_env == 'production') {
		grecaptcha.ready(function() {
			grecaptcha.execute(data_captcha_key, {action: method}).then(function(captcha) {
				form_data.append('captcha',captcha);
				makeCall(form_data,callback);
			})
		})
	}else{
		form_data.append('captcha','dummy');
		makeCall(form_data,callback);
	}
	return callback
}

function makeCall(form_data,callback){
	loading(true);
	return $.ajax({
			type: 'POST',
			url: data_callback_url,
			data: form_data,
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){
				loading(false);
				callback.resolve(data);
			},
			error: function(){
				loading(false);
				callback.reject();
			},
			dataFilter: function(data){
				data = JSON.parse(data);
				// Aqui se puede hacer la evaluaci;on de otras cosas que se manda en el json aparte de payload
				// La funcion solo regresa el payload
				return JSON.stringify(decodePayload(data.payload))
			},
	})
}

(function ($) {
    $.fn.serializeFormJSON = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function logout() {
	if (getCookie('session_token') == '') { return };
	remoteCall('user_logout',false,false).done(function(){
		if ( data_jekyll_env == 'production') {
			gapi.load('auth2', function() {
				var auth2 = gapi.auth2.getAuthInstance();
				auth2.signOut().then(function (){
					//console.log('User signed out.');
				})
			});
		};
	}).always(function(){
  setCookie('session_token','',-1000);
  window.location.replace("/");
  });
}

function formatCurrency(total) {
    var neg = false;
    if(total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}

function parseCurrency(currency) {
    return parseFloat(currency.replace(',','').replace('$',''))
}
