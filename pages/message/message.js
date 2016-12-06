import socket from '../../utils/socket'
import { formatTime } from '../../utils/util'
const app = getApp()

app.getUserInfo()

Page({
  data:{
    text:"",
    title:"标题",
    userInfo: {},
    messages:[],
    animation:{},
    animation_2:{},
    tap:"tapOff",
    height: 0,
    msg: '',
    more: 'ion-ios-plus-outline',
    moreBox:false,
    emotionBox:false,
    emotions: [],
    voicing: false
  },
  tapscroll(e) {
    this.setData({
      emotionBox:false,
      moreBox:false
    })

    this.animation_2.height(this.data.height-50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOff"
      })
  },
  chooseEmotion(e) {
    console.log('emotion:'+e.target.dataset.name)
    this.setData({
      msg: this.data.msg+'['+e.target.dataset.name+']',
      more:'ion-ios-send'
    })
  },
  sendMessage(e) {
    this.setData({
      msg: e.detail.value,
      more: (e.detail.value)?'ion-ios-send':'ion-ios-plus-outline'
    })
  },
  onLoad(options){
    // 页面初始化 options为页面跳转所带来的参数
    socket.onMessage((data)=>{
      if(data.cmd != 'MESSAGE')
        return
      let messages = this.data.messages
      //data.content = data.content.replace(/\[(.*)\]/g, "../../images/face-icons-flat/$1.png")
      data.me = (data.peopleId == app.globalData.peopleId)?true:false
      data.contents = []
      let t = ''
      let lastToken = ''
      for(let i = 0; i<data.content.length;i++){
        if(lastToken == '' && data.content[i] == '['){
          if(t){
            data.contents.push({
              type:'text',
              text:t
            })
          }
          t = ''
          lastToken = '['
        }else if( data.content[i] == ']' && lastToken == '['){
          data.contents.push({
            type:'image',
            url:'../../images/face-icons-flat/'+t+'.png'
          })
          t = ''
          lastToken = ''
        }else{
          t += data.content[i]
        }
      }
      if(t)
        data.contents.push({
          type:'text',
          text: t
        })
      console.log('contents:',data.contents)
      //data.contents = [{type:'text',text:'text'},{type:'text',text:'text'}]
      //data.contents = [{type:'image',url:'../../images/face-icons-flat/smiley_001.png'},{type:'image',url:'../../images/face-icons-flat/smiley_001.png'}]
      messages.push(data)
      this.setData({
        messages: messages
      })
    })
    let emotions = []
    for(let i = 1;i<28;i++){
      let j = i;
      if(j < 10)
        j = '00'+i
      else 
        j = '0'+i
      emotions.push({
        src:'../../images/face-icons-flat/smiley_'+j+'.png',
        id: i,
        name:'smiley_'+j
      })
    }
    this.setData({
      emotions: emotions,
      title:options.name,
      userInfo:app.globalData.userInfo
    })
    

    wx.getSystemInfo({
  success: (res) => {
    this.setData({
      height: res.windowHeight
    })
  }
})

  },
  onReady(){
    // 页面渲染完成

    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation()
  },
  emotionBtn() {
    this.setData({
      moreBox: false,
      emotionBox: (this.data.tap == 'tapOff')?true:false
    })

    if(this.data.tap=="tapOff"){
      this.animation_2.height(this.data.height-200).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOn"
      })
    }else{
      this.animation_2.height(this.data.height-50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOff"
      })
    }
  },
  elseBtn:function(){
    // console.log(e);
    if(this.data.more == 'ion-ios-send'){
      console.log(this.data.msg)
      socket.sendMessage({
        cmd:'MESSAGE',
        peopleId: app.globalData.peopleId,
        roomId: '1000',
        type:'text',
        content: this.data.msg,
        avatar: (app.globalData.userInfo.avatarUrl)?(app.globalData.userInfo.avatarUrl):'http://oh39r65yn.bkt.clouddn.com/5030aff5074dd.jpg',
        name:'life'
      })
      this.setData({
        msg: '',
        more:'ion-ios-plus-outline'
      })
      this.animation_2.height(this.data.height-50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOff"
      })
      return
    }
    this.setData({
      emotionBox: false,
      moreBox: (this.data.tap == 'tapOff')?true:false
    })

    if(this.data.tap=="tapOff"){
      this.animation_2.height(this.data.height-200).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOn"
      })
    }else{
      this.animation_2.height(this.data.height-50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
           tap:"tapOff"
      })
    }
  },
  chooseImg(){

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var t = this.data.message;
        t.push({
          img:this.data.userInfo.avatarUrl,
          imgList:tempFilePaths,
          me:true
        })
        this.setData({
          message:t
        })
      }
    })
  },
  getlocat(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
       this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: '时代一号',
            desc: '现在的位置'
          }],
       
          covers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/images/green_tri.png',
            rotate: 10
          }]
        })
        var t = this.data.message;
          t.push({
            img:this.data.userInfo.avatarUrl,
            me:true,
            map:true
          })
         this.setData({
            message:t
          })
    }})
      
  },
  getvoice:function(){
    if(this.data.voicing){
       wx.stopRecord()
       this.setData({
         voicing:false
       })
    console.log("stop")
      return
    }
    this.setData({
      voicing:true
    })
    console.log("开始录音")
    wx.startRecord({

      success: function(res) {
        console.log("录音成功")
        var tempFilePath = res.tempFilePath 
        console.log('voice:'+tempFilePath)
      },
      complete:function(res){
        console.log("complete"+res)
      },
      fail: function(res) {
        //录音失败
        console.log("fail"+res)
      }
    })
  },
  stopvoice:function(){
    wx.stopRecord()
    console.log("stop")
  }
})