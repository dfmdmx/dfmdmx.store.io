function json_dumps(json_data){
	return JSON.stringify(json_data, null, '\t')
}

function decodePayload(payload){
	var decodedData = JSON.parse(payload);
	return decodedData
}

function encodePayload(payload){
	var encodedData = JSON.stringify(payload);
	return encodedData
}

function create_submit_form(method,payload,files,captcha,session){
	var form_data = new FormData();
	form_data.append('method',method);
	form_data.append('session',session);
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


function remoteCall(method,payload,files,captcha,session){

	var form_data = create_submit_form(method,payload,files,captcha,session);
	if (data_jekyll_env == 'production') {
		grecaptcha.ready(function() {
			grecaptcha.execute(data_captcha_key, {action: method}).then(function(captcha) {
				form_data.append('captcha',captcha);
				makeCall(form_data);
			})
		})
	}else{
		form_data.append('captcha','dummy');
		makeCall(form_data);
	}
}

var callback = $.Deferred();
function makeCall(form_data){
	return $.ajax({
			type: 'POST',
			url: data_callback_url,
			data: form_data,
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){
				callback.resolve(data);
			},
			error: function(){
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

function handshake(name) {
	  var method = 'handshake'
		console.log('Sending greetings...');
	  remoteCall('handshake',{'name':name}).done(function(data){
	  		console.log(data.greetings);
	    }).fail(function(){
	      console.log('handshake Error');
	    }).always(function(){
				console.log('bye');
	    });
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
	var session_token = getCookie('session_token')
	if (session_token == '') { return };
	remoteCall('form_logout',{'session_token':session_token},false,false,session_token).then(function(response){
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

// Se necesita colocar css y html en header para que esto funcione
var loader = {
	runLoader : function () {
		jQuery( '.loading-image' ).toggleClass("stop");
	},
	stopLoader : function () {
		jQuery( '.loading-image' ).toggleClass("stop");
	}
}
