<template>
  <div id="chatting">
    <div class="chatting-area">
      <div class="post">
        <textarea class="postBlank" placeholder="Type in here" v-model="postMessage"></textarea>
        <button ref="post"><strong>POST</strong></button>
      </div>
      <div class="dialog-group">
        <ul class="dialog-item" ref="dialogItem">
          <li class="message" v-for="(message, index) in messages" v-bind:key="index">
            <span id="user-info" class="user-info" v-show="message.user">
              <div class="userIcon">
                <img :src="userImage(message)">
              </div>
              <label class="user-name" for="user-info">{{message.user}}</label>
            </span>
            <transition name="bounce">
              <span v-if="index != 0 || showDelay || !message.user" :class="userMessage(message, index)"><strong>{{message.message}}</strong></span>
            </transition>
          </li>
        </ul>
      </div>
    </div>
    <div class="chatting-config">
      <ul class="icon-select">
        <li v-for="(icon,index) in iconGroup" v-bind:key="index" @click="userIcon = index">
          <div class="icon-container">
            <img :src="icon.src">
          </div>
        </li>
      </ul>
      <ul class="connecters">
        <li v-for="(connecter, index) in connecters" v-bind:key="index">
          <span id="user-info" class="user-info">
              <div class="userIcon">
                <img :src="userImage(connecter)">
              </div>
              <label class="user-name" for="user-info">{{connecter.user}}</label>
            </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import icon from '../../static/icon.json'
/* eslint-disable */
export default {
  data () {
    return {
      username: '',
      userIcon: 0,
      postMessage: '',
      messages: [],
      iconGroup: icon.images,
      showDelay: true,
      socket: '',
      connecters: []
    }
  },
  computed: {
    
  },
  methods: {
    userImage (message) {
      let val = message.userIcon
      if (val || val === 0) {
        return icon.images[val].src
      }
       
    },
    // 对话框样式变更
    userMessage (message, index) {
      let tempClass
      if (message.user){
        tempClass = 'user-message'
      }
      return tempClass
    },
    // 首条信息动画效果
    animateBounceIn () {
      let messages = this.$refs.dialogItem.children
    },
    //消息出现动画效果
    changeShow() {
      this.showDelay = true
    },
    logout () {
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('userIcon')
    }
  },
  created () {
    // 读取聊天记录
  },
  mounted () {
    
    // 保留用户名
    this.socket = io.connect('ws://127.0.0.1:3000/')
    
    this.username = sessionStorage.username
    this.userIcon = sessionStorage.userIcon
    //发送进入信息
    this.socket.emit('login', {
      username: this.username,
      userIcon: this.userIcon
    })
    //websocket服务
    this.socket.on('connectStatus',data => {
      console.log(data)
    })
    // 收到新消息
    this.socket.on('getMessage',data => {
      if(typeof data === 'string') {
        this.messages.unshift({
          message: `>>>${data}`
        })
      } else {
        this.messages.unshift(data)
      }
    })
    //注册post点击事件
    this.$refs.post.addEventListener('click', () => {
      let parms = {
        'user': this.username,
        'message': this.postMessage,
        'userIcon': this.userIcon
      }
      this.socket.emit('newMessage', parms)
      this.postMessage = ''
    })
    // 更新参与者
    this.socket.on('connecter', data => {
      this.connecters = data
    })
    //离开页面logout
    window.onunload = () => {
      this.socket.emit('logout', {
      username: this.username
      })
    }
  },
  watch: {
    messages () {
      this.showDelay = false
      var timer = setTimeout(this.changeShow, 50)
    },
    $route(to, from) {
      this.logout()
    }

  },
  destroyed() {
    
  }
}
</script>

<style>
#chatting {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.chatting-area {
  flex: 1;
  border-right: 10px solid white;
  display: flex;
  flex-direction: column;
}
.chatting-config {
  width: 25rem;
}
.post {
  height: 12.5rem;
  background-color: #bbbbbb;
  position: relative;
}
.post textarea {
  width: 40rem;
  height: 6.25rem;
  position: absolute;
  left: 50%;
  top: 3rem;
  transform: translateX(-50%);
  resize: none;
}
.post button {
  width: 10rem;
  height: 1.875rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: .625rem;
}
.dialog-group {
  flex: 1;
  width: 50rem;
  margin: 0 auto;
  padding-top: .9375rem;
  overflow: auto;
}
.message {
  display: flex;
  flex-direction: row;
  color: white;
  list-style-type: none;
  margin-bottom: 1.875rem;
  overflow: hidden;
}
.user-info {
  display: inline-block;
  width: 80px;
  height: 100px;
  position: relative;
}
.user-message {
  margin: 0.6rem 1.2rem 1.2rem 1.2rem;
  padding: 1.2rem 1.2rem 1rem 1.2rem;
  border: .3125rem solid white;
  background-image:linear-gradient(rgb(105, 221, 247) 0px, rgb(93, 210, 237) 50%, rgb(1, 188, 228) 51%, rgb(4, 185, 226) 100%);
  border-radius: 1.5rem;
  display: inline-block;
  word-wrap: break-word;
  word-break:break-all;
}
.postBlank {
  box-sizing:border-box;
  border-radius: 1.25rem;
  padding: .625rem;
  border:1px solid gray;
}
.entering {
  margin-left: 6.25rem;
}
.connecters {
  width: 25rem;
}
.connecters li{
  display: inline-block;
  margin: 10px;
}
.icon-select {
  width: 25rem;
  height: 0;
  overflow: hidden;
}
.icon-select li {
  list-style-type: none;
  display: inline-block;
  margin: .3125rem;
}
.icon-container {
  width: 6rem;
  height: 6rem;
}
.icon-container img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.userIcon {
  width: 100%;
}
.userIcon img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.user-name {
  position: absolute;
  left: 50%;
  bottom: .08rem;
  transform: translate(-50%);
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
  }
  25% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
.connecters li{
  color: white;
}
</style>
