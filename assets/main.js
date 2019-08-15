function decodePayload(payload){
	var decodedData = JSON.parse(payload);
	return decodedData
}

function encodePayload(payload){
	var encodedData = JSON.stringify(payload);
	return encodedData
}


function remoteCall(method,args,uploadfiles){
	loader.runLoader();
	var form_data = new FormData();
	form_data.append('method',method);
	form_data.append('payload',encodePayload(args));
	if (uploadfiles) {
		console.log(uploadfiles);
		var uploadfile;
		for (var i = 0; i < uploadfiles.length; i++) {
			uploadfile = uploadfiles[i];
			console.log(uploadfile);
			form_data.append('file[]',uploadfile,uploadfile.name);
		}
	}
	return $.ajax({
			type: 'POST',
			url: data_callback_url,
			data: form_data,
			contentType: false,
			cache: false,
			processData: false,
			dataFilter: function(data){
				data = JSON.parse(data);
				// Aqui se puede hacer la evaluaci;on de otras cosas que se manda en el json aparte de payload
				// La funcion solo regresa el payload
				return JSON.stringify(decodePayload(data.payload))
				},
			},
	).always(function(){loader.stopLoader();});

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

function getUser() {
	var session_token = getCookie('session_token')
	if (session_token != '') {
	 return remoteCall('user_by_session',{'session_token':session_token}).then(function(response){
			var user = response.user;
			return user;
		}).fail(function(){
			return false;
		}).always(function(){
			return false;
		});
	} else {
		return false;
	};
}

function logout() {
	var session_token = getCookie('session_token')
	if (session_token == '') { return };
	remoteCall('user_logout',{'session_token':session_token}).then(function(response){

		gapi.load('auth2', function() {
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signOut().then(function () {
	      //console.log('User signed out.');
	    });
		});

	  }).fail(function(){
		//console.log('serverapp signout error')
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
