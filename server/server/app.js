var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

let connecter = []  //  链接者
server.listen(3000, () =>{
  console.log('server run at port 3000')
});

// app.listen(3000, () =>{
//   console.log('server run at port 3000')
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
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

module.exports = app;
