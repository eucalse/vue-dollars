var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, () =>{
  console.log('server run at port 3000')
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  //接受用户名
  socket.on('login', data => {
    let username = data.username
    console.log(`${username}进入聊天室`)
    io.sockets.emit('getMessage',`${username}进入聊天室`)
  })
  // 通知连接成功
  socket.broadcast.emit('')
  socket.emit('connectStatus', 'success');
  //  收到新消息时
  socket.on('newMessage', function (data) {
    io.sockets.emit('getMessage', data)
  })
});

