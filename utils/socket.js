const peopleId = getApp().globalData.peopleId
console.log('peopleId:', peopleId)

class Socket {
  constructor(host) {
    this.host = host
    this.connected = false
    wx.connectSocket({
      url: this.host
    })
    
    // 监听连接成功
    wx.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！')
      this.connected = true
      wx.sendSocketMessage({
          data: JSON.stringify({
            peopleId: peopleId,
            cmd: 'JOIN',
            roomId: '1000'
          })
      })
    })

    // 监听连接断开
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败，请检查！')
      this.connected = false
      wx.connectSocket({
        url: this.host
      })
    })

    // 监听连接关闭
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      this.connected = false
      wx.connectSocket({
        url: this.host
      })
    })

  }

  sendMessage(data) {
    if(!this.connected){
      console.log('not connected')
      return
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data)
    })
  }

  

  onMessage(callback) {
    if(typeof(callback) != 'function')
      return
    // 监听服务器消息
    wx.onSocketMessage((res) => {
      const data = JSON.parse(res.data)
      callback(data)
    })
  }
}

const socket = new Socket('wss://socket.getweapp.com')

export default socket