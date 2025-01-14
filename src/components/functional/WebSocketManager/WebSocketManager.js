// messageManager.js
import { connect, disconnect, errorOccurred } from '@/store/modules/Socket';
import { addMessage, setMessage} from '@/store/modules/Messages';
import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { webSocket } from '@/utils/webSocket';
import {addMessageToConversation} from '@/store/modules/Conversations';
import {insertMessage} from '@/utils/database';
import {debug, ableToFetchFromServer} from '@/appConfig';

let reconnectTimerRef = null; // 定时器用于重连

// WebSocket 管理函数
export const useWebSocketManager = (handleReceivedMessage) => {
  const dispatch = useDispatch();
  let maxRetryNum = 1;
  let retryCounts = 0;
  const connectWebSocket = () => {
    webSocket.onopen = () => {
      console.log('WebSocket connection established');
      if (reconnectTimerRef) {
        clearInterval(reconnectTimerRef); // 清理之前的重连定时器
      }
      dispatch(connect());  // 保存 WebSocket 实例
    };

    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // console.log('Received data: ', data);
      if (!debug || ableToFetchFromServer) {
        handleReceivedMessage(data.data);
      }
    };

    webSocket.onerror = (e) => {
      console.log('WebSocket error:', e.message);
      dispatch(errorOccurred(e));  // 清除 WebSocket 实例
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
      dispatch(disconnect());  // 清除 WebSocket 实例
      reconnectTimerRef = setInterval(() => {
        console.log('WebSocket connection is closed, reconnecting...');
        retryCounts++;
        if (retryCounts > maxRetryNum) {
          clearInterval(reconnectTimerRef); // 清理重连定时器
          return;
        }
        connectWebSocket(); // 尝试重新连接
      }, 5000); // 5 秒后尝试重新连接
    };
  };

  useEffect(() => {
    // 初始化 WebSocket 连接
    connectWebSocket();

    return () => {
      console.log('WebSocket cleaned');
      // 清理 WebSocket 和定时器
      if (webSocket) {
        webSocket.close();
      }
      if (reconnectTimerRef) {
        clearInterval(reconnectTimerRef); // 清理重连定时器
      }
    };
  }, []); // 只在组件挂载时执行一次，确保 WebSocket 只初始化一次
};
