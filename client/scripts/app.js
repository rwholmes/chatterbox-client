// YOUR CODE HERE:
var sendMessage = function() {
	var message = {
	  'username': 'shawndrost',
	  'text': 'trololo',
	  'roomname': '4chan'
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

var messageArray = [];
var getMessages = function() {
	$.ajax({
	  // always use this url
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'GET',
	  contentType: 'application/json',
	  success: function (data) {
	  	for (var i=0; i<data.results.length; i++) {
	  		console.log(data.results[i]);
	  	}
	  },
	  error: function (data) {
	    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to get messages');
	  }
	});
};
