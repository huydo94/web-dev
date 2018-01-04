var socketio = io.connect();
var nameClientIdMap = [];

$(function() {
  $("#nameForm").on('submit', function(e){
    e.preventDefault();
    nickname = String($("#nickname").val());
    socketio.emit('nickname', nickname);
    $("#user").hide();
    $("#topbar span").text('Greetings, '+nickname);
    $("#chatInterface").show();
  });
  $("#roomForm").on('submit', function(e){
    e.preventDefault();
    var roomID = String($("#roomID").val());
    var roomType = String($("[name='roomType']:checked", "#roomForm").val());
    var roomPSW = String($("[name='psw']", "#roomForm").val());
    console.log(roomPSW);
    socketio.emit('createRoom', {roomID: roomID, roomType:roomType, psw:roomPSW});
  });
  $("#joinRoomForm").on('submit', function(e) {
    e.preventDefault();
    var roomID = String($("#joinRoomID").val());
    console.log(roomID);
    socketio.emit('joinRoom', roomID);
  });
  $("#clientForm").on('submit', function(e) {
    e.preventDefault();
    var data = $("#clientForm :input").serializeArray();
    console.log(document.getElementById("action").value);
    var userid = data[0].value;
    var action = document.getElementById("action").value;
    var roomid = document.getElementById("currentRoom").value;
    var pmtext = document.getElementById("PMcontent").value;
    document.getElementById("PMcontent").value ='';
    socketio.emit('usermanagement',{action: action,userid: userid, roomID: roomid, pmtext: pmtext});
  });

  socketio.on('roomExists', function(roomExists) {
    if (roomExists) {
      alert("Room already exists");
    }
    else {
      alert("Room Created");
      $("#roomForm").hide();
    }
  });
  socketio.on('refreshRooms', function(data) {
    var roomDiv = $("#chatLobby").find("#"+data.roomType+"Rooms");
    var newRoom = document.createElement("div");
    newRoom.setAttribute("class", "room");
    // newRoom.appendChild(document.createElement("span").appendChild(document.createTextNode(data.roomID)));
    newRoom.appendChild(document.createTextNode(data.roomID));
    newRoom.addEventListener("click",roomClicked, true);
    roomDiv.append(newRoom);
  });
//Get clients' nicknames, id's of roomID
  socketio.on('roomData', function(data){
    $("#kick").hide();
    $("#ban").hide();
    $("#clientForm").empty();
  // stacks of client names & Ids
    var nameStack = data.nameStack;
    var idStack = data.idStack;
    $("#functionModule").children().hide();
    while (nameStack.length>0) {
      var user = nameStack.pop();
      var id = idStack.pop();
// Map id's to nicknames
      nameClientIdMap[user] = id;
      $("#clientForm").prepend("<div id='"+id+"_container'><input type='radio' name='user' value='"+id+"' id='"+id+"'><label for='"+id+"'>"+user+"</label><br></div>");
    }
    $("#roomClients h5").text("Room: "+data.roomID);
    document.getElementById("currentRoom").value = data.roomID;
    $("#roomClients").show();
  });
  socketio.on('isOwner', function(data) {
    $("#kick").show();
    $("#ban").show();
  });
  socketio.on('askPSW', function(roomID) {
    var psw = prompt("Enter room password:");
    if (psw == null) {
      alert("Prompt Cancelled");
    }
    else {
      socketio.emit('checkPSW', {psw:psw, roomID:roomID});
    }
  });
  socketio.on('msgFromServer', function(msg) {
    alert(msg);
  });

  socketio.on('banned', function(data) {
    $("#rooms .room:contains("+data.roomID+")").remove();
    if (roomWindowOpen(data.roomID)) {
      var roomWindow = $(".roomName:contains("+data.roomID+")");
      roomWindow.closest(".chatBox").find(".msgBox").empty();
      roomWindow.empty();
    }
    socketio.emit('banme',{roomID: data.roomID});
    alert("You are banned.");
  });
  socketio.on('kicked', function(data) {
    $("#rooms .room:contains("+data.roomID+")").remove();
    if (roomWindowOpen(data.roomID)) {
      var roomWindow = $(".roomName:contains("+data.roomID+")");
      roomWindow.closest(".chatBox").find(".msgBox").empty();
      roomWindow.empty();
    }
    socketio.emit('kickme',{roomID: data.roomID});
    alert("You are kicked out of the room.");
  });
  socketio.on('some1Gone', function(userid){
    $("#"+userid+"_container").remove();
  });
  socketio.on('message', function(data) {
    if (roomWindowOpen(data.roomID)) {
      var msg = data.msg;
      var nickname = data.nickname;
      var chatBox = $(".roomName:contains("+data.roomID+")").closest(".chatBox").attr("id");
      var textBox= $("#"+chatBox).find(".msgBox");
      textBox.append("<span><b>"+nickname+":</b>&emsp;"+msg+"</span><br><br>");
      scrollToBottom(chatBox);
    }
  });
    socketio.on('clearAll', function() {
    $("#allpublicRooms").empty();
    $("#allprivateRooms").empty();
  });
  socketio.on('listAll', function(data) {
    var roomDiv = $("#allChatLobby").find("#all"+data.roomType+"Rooms");
    var newRoom = document.createElement("div");
    newRoom.setAttribute("class", "room");
    newRoom.appendChild(document.createTextNode(data.roomID));
    roomDiv.append(newRoom);
  });

});
