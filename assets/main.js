function json_dumps(json_data){
	return JSON.stringify(json_data, null, '  ').replace(/"/g, '').replace(/,/g, '').replace(/,/g, '').replace(/{/g, '').replace(/}/g, '')
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
	if (getCookie('session_token') == '') { return };
	remoteCall('form_logout',false,false).done(function(){
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

.perfundo__overlay{display:-webkit-box;display:-ms-flexbox;display:flex;visibility:hidden;position:fixed;top:0;right:0;bottom:0;left:0;z-index:999;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;background-color:rgba(0,0,0,.9)}.perfundo__overlay.is-active,.perfundo__overlay:target{visibility:visible}.perfundo__content{max-height:100%;overflow:auto}.is-active>.perfundo__content,:target>.perfundo__content{-webkit-animation:.4s ease-out .2s both;animation:.4s ease-out .2s both;-webkit-animation-name:inherit;animation-name:inherit}.perfundo__html{padding:2em;max-width:42em;background-color:#fff}.perfundo__figure{display:none;margin:1.5em}.is-active>.perfundo__figure,:target>.perfundo__figure{display:block}.perfundo__figure img{display:block;height:0}.perfundo__figcaption{color:#fff}.perfundo__image{max-width:100%;background-size:100%}.perfundo__control{position:absolute}.perfundo__control,.perfundo__control:visited{color:#fff}.perfundo__close{top:1em;right:1em}.perfundo__prev{left:2em}.perfundo__next{right:2em}.perfundo__untarget{position:fixed;top:0}.perfundo__next,.perfundo__prev{top:50%;margin-top:-1.5em;opacity:.2;-webkit-transition:opacity .2s;transition:opacity .2s}.perfundo__next:focus,.perfundo__next:hover,.perfundo__prev:focus,.perfundo__prev:hover{opacity:1}
