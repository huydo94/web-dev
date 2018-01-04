var http = require("http"),
    socketio = require("socket.io"),
    fs = require("fs"),
    path = require("path");

var server = http.createServer(function(req, res) {

  var filePath = req.url;

  if (filePath == '/') {
    filePath = './chat.html';
  }

  filePath = "./"+filePath;
  var extname = path.extname(filePath);
  var contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  fs.exists(filePath, function(exists){

    if (exists) {

      fs.readFile(filePath, function (err,data) {
        if(err) {
          return res.writeHead(500);
        }
        else {
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
      }
    });
  }

  });

}).listen(3456);
console.log("Running on Port 3456");

var io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('nickname', function(nickname) {
    socket.nickname = nickname;
    console.log(socket.id);
    var rooms = io.sockets.adapter.rooms;
    io.sockets.to(socket.id).emit('clearAll');
    for (var room in rooms) {
      console.log(room);
      var roomType = io.sockets.adapter.rooms[room].type;
      io.sockets.to(socket.id).emit('listAll',{roomID:room, roomType:roomType});
    }
  });
  socket.on('createRoom', function(data) {
    var thisRoom = io.sockets.adapter.rooms[data.roomID];
    var roomExists = thisRoom === undefined ? 0:1;
    if (!roomExists) {
        socket.join(data.roomID);
        io.sockets.adapter.rooms[data.roomID].banList = [];
        io.sockets.adapter.rooms[data.roomID].type = data.roomType;
        io.sockets.adapter.rooms[data.roomID].owner = socket.id;
        if (data.roomType=="private") {
          io.sockets.adapter.rooms[data.roomID].psw = data.psw;
        }
        io.sockets.emit('listAll',{roomID:data.roomID, roomType:data.roomType});
        io.sockets.to(socket.id).emit('refreshRooms', {roomID:data.roomID,roomType:io.sockets.adapter.rooms[data.roomID].type});
    }
    io.sockets.to(socket.id).emit('roomExists', roomExists);

  });
  socket.on('joinRoom', function(roomID) {
    var thisRoom = io.sockets.adapter.rooms[roomID];
    var roomExists = thisRoom === undefined ? 0:1;
    if (!roomExists) {
      io.sockets.to(socket.id).emit('msgFromServer',"Room does not exist.");
    }
    else if(io.sockets.adapter.rooms[roomID].banList.indexOf(socket.id) != -1){
      io.sockets.to(socket.id).emit('msgFromServer',"Cannot join. You are banned from this room.");
    }else if(io.sockets.adapter.sids[socket.id][roomID]){
      //Already joined the room. Do nothing.
    }
    else if (io.sockets.adapter.rooms[roomID].type == "private") {
      io.sockets.to(socket.id).emit('askPSW',roomID);
    }
    else {
      socket.join(roomID);
      io.sockets.to(socket.id).emit('refreshRooms', {roomID:roomID,roomType:io.sockets.adapter.rooms[roomID].type});
    }
  });
  socket.on('checkOwner', function(roomID) {
    var nameStack=[];
    var idStack=[];
    var roomClients = io.sockets.adapter.rooms[roomID].sockets;
    for (var clientId in roomClients) {
      var nickname = io.sockets.connected[clientId].nickname;
      nameStack.push(nickname);
      idStack.push(clientId);
    }
    io.sockets.to(socket.id).emit('roomData', {roomID:roomID, nameStack:nameStack, idStack:idStack});

    if (socket.id==io.sockets.adapter.rooms[roomID].owner) {
      io.sockets.to(socket.id).emit('isOwner');
    }

  });
  socket.on('checkPSW', function(data) {
    if (data.psw == io.sockets.adapter.rooms[data.roomID].psw) {
      socket.join(data.roomID);
      io.sockets.to(socket.id).emit('refreshRooms', {roomID:data.roomID,roomType:io.sockets.adapter.rooms[data.roomID].type});
    }
    else {
      io.sockets.to(socket.id).emit('msgFromServer',"Wrong Password. Room Denied");
    }
  });
  socket.on('sendMessage', function(data) {
    console.log(io.sockets.adapter.sids[socket.id][data.roomID]);
    if (io.sockets.adapter.sids[socket.id][data.roomID]) {
      io.sockets.to(data.roomID).emit('message', {roomID:data.roomID, nickname:socket.nickname, msg:data.msg});
    }
  });
  socket.on('usermanagement',function(data){
    console.log(data.action);
    if(data.action == 'ban'){
      io.sockets.adapter.rooms[data.roomID].banList.push(data.userid);
      io.sockets.to(data.userid).emit('banned', {roomID:data.roomID});
      io.sockets.to(data.roomID).emit('some1Gone', data.userid);
    }
    if(data.action == 'kick'){
      io.sockets.to(data.userid).emit('kicked',{roomID:data.roomID});
      io.sockets.to(data.roomID).emit('some1Gone', data.userid);
    }
    if(data.action == 'PM'){
      console.log(data.pmtext);
      var msg = "PM from " + socket.nickname +" : " + data.pmtext;
      io.sockets.to(data.userid).emit('msgFromServer',msg);
    }
  });
  socket.on('kickme',function(data){
    socket.leave(data.roomID);
  });
  socket.on('banme',function(data){
    socket.leave(data.roomID);
  });
});
