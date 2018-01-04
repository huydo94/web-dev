var nickname;
var roomCount = 0;

$(function () {
  //Toggle Chats"
  $(".boxTop").on("click", function() {
      var chatNum = $(this).closest('.chatBox');
      chatNum.find('.boxBottom').first().toggle();
  });
  $('.textArea').bind('keyup', function(e) {
    if ( e.keyCode === 13 ) { // 13 is enter key
      var $chatBox = $(this).closest('.chatBox');
      var roomName = $chatBox.find(".roomName").first().text();
      if (roomName !='') {
        var msg = $(this).val();
        socketio.emit('sendMessage',{msg:msg, roomID:roomName});
        console.log(msg);
        $(this).val('');
      }
    }
  });
  $("#createRoom").on("click", function() {
    $("#functionModule").children().hide();
    $("#roomForm").show();
  });
  $("input[type='radio']#private").on("click", function() {
    $("#password").show();
  });
  $("input[type='radio']#public").on("click", function() {
    $("#password").hide();
  });
  $("#joinRoom").on("click", function() {
    $("#functionModule").children().hide();
    $("#joinRoomForm").show();
  });
  $("#kick").on("click", function() {
    document.getElementById("action").value = 'kick';
    $("#clientForm").submit();

  });
  $("#ban").on("click", function() {
    document.getElementById("action").value = 'ban';
    $("#clientForm").submit();
    
  });
  $("#privateMsg").on("click", function() {
    document.getElementById("action").value = 'PM';
    $("#clientForm").submit();
    
  });
});

function roomClicked() {
  var roomID = $(this).text();
  socketio.emit('checkOwner', roomID);
  if (!roomWindowOpen(roomID)) {
    roomCount = roomCount%3;
    switch (roomCount) {
      case 0:
        var $chatWindow = $("#chat1");
        break;

      case 1:
        var $chatWindow = $("#chat2");
        break;

      case 2:
        var $chatWindow = $("#chat3");
        break;
    }
    $chatWindow.find(".roomName").first().text(roomID);
    roomCount++;
  }
}

function roomWindowOpen(roomID) {
  if ($(".boxTop > span.roomName:contains('"+roomID+"')").length>0) {return 1;}
  else {return 0;}
}

function scrollToBottom(chatBox) {
  var divObj = $("#"+chatBox).find('.msgBox');
  divObj.scrollTop($(divObj)[0].scrollHeight);
}
