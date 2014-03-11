/* Global _$ */

var app = window.app;

app = {

  init: function() {
    // variables
    app.room = 'Default';
    app.friendList = {};
    app.roomList = {};
    app.currentUserName = window.location.href.split('=')[1];

    // jquery selectors
    app.$refresh = $('.refresh');
    app.$ulMessages = $('ul.messages');
    app.$send = $('.send');
    app.$userMessage = $('.userMessage');
    app.$sendRoomName = $('.sendRoomName');
    app.$roomName = $('.roomName');
    app.$roomsUl = $('ul.rooms');
    app.$friendsUl = $('ul.friends');

    // jQuery listeners
    app.$refresh.on('click', function(event) {
      event.preventDefault();
      app.$ulMessages.empty();
      app.getMessages();
    });

    app.$send.on('click', function(event) {
      event.preventDefault();
      var message = app.$userMessage.val();
      app.sendMessage(message);
      app.$userMessage.val('');
      app.$ulMessages.empty();
      app.getMessages();
    });

    app.$sendRoomName.on('click', function(event) {
      event.preventDefault();
      app.room = app.$roomName.val() || 'Default';
      app.$roomName.val('');
      app.$ulMessages.empty();
      app.getMessages();
    });

    setTimeout(function() {
      app.$ulRoomsA = $('ul.rooms a');
      app.$ulRoomsA.on('click', function(event) {
        event.preventDefault();
        app.room = $(this).text() || 'Default';
        app.$ulMessages.empty();
        app.getMessages();
      });
    }, 1200);

    app.getMessages();
    app.renderLinks();

  },

  // methods
  sendMessage: function(message) {
    var message = {
      'username': app.currentUserName,
      'text': message,
      'roomname': app.room
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
  },

  getMessages: function() {
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
          if (app.room === 'Default' || app.room === chatRoom) {
            if (message !== undefined && username && message && username.charAt(0) !== '<' && message.charAt(0) !== '<' && message.length < 160 && username.length < 160) {
              if (app.friendList[username]) {
                var $message = $('<li class="friend-message"></li>');
              }
              else {
                var $message = $('<li></li>');
              }
              var $username = $('<a class="nameLink" href="#"></a>');
              $username.text(username);
              $message.text(': ' + message);
              $message.prepend($username);
              app.$ulMessages.append($message);
              if (chatRoom && !app.roomList[chatRoom]) {
                app.roomList[chatRoom] = true;
                app.renderRooms(chatRoom);
              }
            }
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to get messages');
      }
    });
    app.renderLinks();
  },

  renderLinks: function() {
    setTimeout(function(){
      $('.nameLink').on('click', function(event) {
        event.preventDefault();
        if (!app.friendList[this.text]) {
          app.friendList[this.text] = true;
          app.$friendsUl.append('<li><a class="currentFriend" href="#">' + this.text + '</a></li>');
        }
      });
    }, 1200);
  },

  renderRooms: function(currentRoom) {
    var $room = $('<li class="room"></li>');
    var $roomLink = $('<a class="roomLink" href="#"></a>').text(currentRoom);
    $room.append($roomLink);
    app.$roomsUl.append($room);
  }

};








