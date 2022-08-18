// @/utils/websocket.js
//import { isJSON } from "@/utils/utils"
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            // console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    // console.log('It is not a string!')
}
class WebSocketClass {
  constructor(url) {
    this.lockReconnect = false;  // 是否开始重连
    this.wsUrl = "";  // ws 地址
    this.globalCallback = null;  // 回调方法
    this.userClose = false;  // 是否主动关闭
    this.createWebSocket(url);
  }

  createWebSocket(url) {
    if (typeof (uni.connectSocket) === 'undefined') {
      this.writeToScreen("您的浏览器不支持WebSocket，无法获取数据");
      return false
    }

    this.wsUrl = url;
    try {
      // 创建一个this.ws对象，发送、接收、关闭socket都由这个对象操作
      let that = this
      this.ws = uni.connectSocket({
        url: this.wsUrl,
        success(data) {
          console.log("websocket连接成功");
         setTimeout(() => {
         	that.initEventHandle();
         }, 800)
          
        },
      });
      
    } catch (e) {
      this.reconnect(url);
    }
  }

  // 初始化
  initEventHandle() {
    // 监听WebSocket连接打开成功
    this.ws.onOpen(res => {
      console.log('WebSocket连接打开'); 
      

    });
    
    // 连接关闭后的回调函数
    this.ws.onClose(() => {
      if (!this.userClose) {
        this.reconnect(this.wsUrl); //重连
      }
    });
    
    // 报错时的回调函数
    this.ws.onError(() => {
      if (!this.userClose) {
        this.reconnect(this.wsUrl); //重连
      }
    });

    // 收到服务器数据后的回调函数
    this.ws.onMessage(event => {
      if(isJSON(event.data)) {
        const jsonobject = JSON.parse(event.data)

        this.globalCallback(jsonobject)
      }else {
        this.globalCallback(event.data)
      }
    });
  }

  // 关闭ws连接回调
  reconnect(url) {
    if (this.lockReconnect) return;
    this.ws.close();
    this.lockReconnect = true;  // 关闭重连，没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket(url);
      this.lockReconnect = false;
    }, 30000);  // 重连延迟时间
  }

  // 发送信息方法
  webSocketSendMsg(msg) {
    this.ws && this.ws.send({
      data: msg,
      success() {
        console.log("消息发送成功");
      },
      fail(err) {
        console.log("关闭失败", err)
      }
    });
  }

  // 获取ws返回的数据方法
  getWebSocketMsg(callback) {
    this.globalCallback = callback
  }

  // 关闭ws方法
  closeSocket() {
    if (this.ws) {
      this.userClose = true;
      this.ws.close({
        success(res) {
          console.log("关闭成功", res)
        },
        fail(err) {
          console.log("关闭失败", err)
        }
      });
    }
  }

  writeToScreen(massage) {
    console.log(massage);
  }
}
export default WebSocketClass;

