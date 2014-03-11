/* Global _$ */
var currentUserName = window.location.href.split('=')[1];

var room = 'Default';
var friendList = {};

var sendMessage = function(message) {
	var message = {
    'username': currentUserName,
    'text': message,
    'roomname': room
  };
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var getMessages = function() {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: 'order=-createdAt',
    success: function(data) {
      for (var i = 0; i < 100; i++) {
        var username = data.results[i].username;
        var message = data.results[i].text;
        var chatRoom = data.results[i].roomname;
        if (room === 'Default' || room === chatRoom) {
	        if (message !== undefined && username && message && username.charAt(0) !== '<' && message.charAt(0) !== '<' && message.length < 160 && username.length < 160) {
	        	if (friendList[username]) {
							var $message = $('<li class="friend-message"></li>');
	        	}
	        	else {
							var $message = $('<li></li>');
	        	}
						var $username = $('<a class="nameLink" href="#"></a>');
						$username.text(username);
						$message.text(': ' + message);
						$message.prepend($username);
						$('ul.messages').append($message);
	        }
        }
      }
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get messages');
    }
	});
	renderLinks();
};

var renderLinks = function() {
	setTimeout(function(){
		$('.nameLink').on('click', function(event) {
			event.preventDefault();
			if (!friendList[this.text]) {
				friendList[this.text] = true;
				$('ul.friends').append('<li><a class="currentFriend" href="#">' + this.text + '</a></li>');
			}
		});
	}, 1200);
};

$(document).ready(function(){

	getMessages();

	$('.refresh').on('click', function(event) {
		event.preventDefault();
		$('ul.messages').empty();
		getMessages();
	});

	$('.send').on('click', function(event) {
		event.preventDefault();
		var message = $('.userMessage').val();
		sendMessage(message);
		$('.userMessage').val('');
		$('ul.messages').empty();
		getMessages();
	});

	$('.sendRoomName').on('click', function(event) {
		event.preventDefault();
		room = $('.roomName').val() || 'Default';
		$('.roomName').val('');
		$('ul.messages').empty();
		getMessages();
	});

	renderLinks();
});








