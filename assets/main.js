function decodePayload(payload){
	var decodedData = JSON.parse(payload);
	return decodedData
}

function encodePayload(payload){
	var encodedData = JSON.stringify(payload);
	return encodedData
}

function remoteCall(method,args){
	return $.post(callback_url,  // url
	       {'method':method,'payload': encodePayload(args)}).then( // data to be submit
	       function(data, status, xhr,) {
					 return $.Deferred().resolve(decodePayload(data.payload)).promise();
	       });
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

function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
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
	if (session_token != '') {
	 return remoteCall('user_logout',{'session_token':session_token}).then(function(response){
		  setCookie('session_token','',-1000);
			location.reload();
		}).fail(function(){
			setCookie('session_token','',-1000);
			location.reload();
		});
	} else {
		return false;
	};
}
