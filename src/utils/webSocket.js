import {connect, disconnect, errorOccurred} from '@/store/modules/Socket';
import {setMessage} from '@/store/modules/Messages';

const webSocket = new WebSocket('ws://localhost:4023');
let reconnectTimer;

webSocket.onopen = () => {
  console.log('WebSocket connection established');
  if (reconnectTimer) {
    clearInterval(reconnectTimer);  // 清理之前的重连定时器
  }
  // dispatch(connect());  // 保存 WebSocket 实例
};

webSocket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('Received data: ', data);
  // dispatch(setMessage(data.data));  // 更新状态以显示从服务器接收到的消息
};

webSocket.onerror = (e) => {
  console.log('WebSocket error:', e.message);
  // dispatch(errorOccurred(e));  // 清除 WebSocket 实例
};

webSocket.onclose = () => {
  console.log('WebSocket connection closed');
  // dispatch(disconnect());  // 清除 WebSocket 实例
  reconnectTimer = setInterval(() => {
    console.log('WebSocket connection is closed, reconnecting...');
    // connectWebSocket();
  }, 5000); // 5 秒后尝试重新连接
};

export { webSocket };
