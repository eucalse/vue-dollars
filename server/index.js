var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

let connecter = []  //  链接者

server.listen(3000, () =>{
  console.log('server run at port 3000')
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  //接受用户名
  socket.on('login', data => {
    if (data.username) {
      let username = data.username
      let userIcon = data.userIcon
      // 刷新不重新登录
      if (connecter.indexOf(username)) {
        
      }
      connecter.push({
        user: username,
        userIcon: userIcon
      })
      console.log(connecter)
      io.sockets.emit('getMessage',`${username}进入聊天室`)
      io.sockets.emit('connecter', connecter)
    }
    // else if(data.user == 'undefined') {
    //   socket.emit('undefinedUser', '请先登录')
    // }
  })
  // 广播退出聊天室
  socket.on('logout',data => {
    let username = data.username
    for (var i = 0; i < connecter.length; i++) {
      if (connecter[i].user === username) {
        connecter.splice(i,1)
      }
    }
    if (username) {
      io.sockets.emit('getMessage',`${username}离开了聊天室`)
      io.sockets.emit('connecter', connecter)
    }
  })
  // 通知连接成功
  socket.broadcast.emit('')
  socket.emit('connectStatus', 'success');
  //  收到新消息时
  socket.on('newMessage', function (data) {
    io.sockets.emit('getMessage', data)
  })
  socket.on('disconnect', data => {
    // return 
  })
});

