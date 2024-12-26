import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {connect, disconnect, errorOccurred} from '../../store/modules/Socket';
import {setMessage} from '../../store/modules/Messages';
import {useDispatch} from 'react-redux';

// 创建 WebSocket 上下文
const WebSocketContext = createContext(null);

const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);  // 防止类型错误
  const dispatch = useDispatch();

  // 创建 WebSocket 连接的函数
  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket('ws://localhost:4023');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      if (reconnectTimerRef.current) {
        clearInterval(reconnectTimerRef.current);  // 清理之前的重连定时器
      }
      dispatch(connect());  // 保存 WebSocket 实例
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Received data: ', data);
      dispatch(setMessage(data.data));  // 更新状态以显示从服务器接收到的消息
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error:', e.message);
      dispatch(errorOccurred(e));  // 清除 WebSocket 实例
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      dispatch(disconnect());  // 清除 WebSocket 实例
      reconnectTimerRef.current = setInterval(() => {
        console.log('WebSocket connection is closed, reconnecting...');
        connectWebSocket();
      }, 5000); // 5 秒后尝试重新连接
    };
  });

  useEffect(() => {
    // 初始化 WebSocket 连接
    connectWebSocket();

    return () => {
      // 清理 WebSocket 和定时器
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      if (reconnectTimerRef.current) {
        clearInterval(reconnectTimerRef.current);  // 清理重连定时器
      }
    };
  }, [connectWebSocket, reconnectTimerRef, ws]);  // 只在组件挂载时触发一次，不需要依赖 `ws` 和 `dispatch`

  return ws;
};

// WebSocket 提供者组件
export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const reconnectTimerRef = useRef(null);
  const dispatch = useDispatch();
  const connectWebSocket = useCallback(()=> {
    ws.current = new WebSocket('ws://localhost:4023');
    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      if (reconnectTimerRef.current) {
        clearInterval(reconnectTimerRef.current);  // 清理之前的重连定时器
      }
      dispatch(connect());  // 保存 WebSocket 实例
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Received data: ', data);
      dispatch(setMessage(data.data));  // 更新状态以显示从服务器接收到的消息
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error:', e.message);
      dispatch(errorOccurred(e));  // 清除 WebSocket 实例
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      dispatch(disconnect());  // 清除 WebSocket 实例
      reconnectTimerRef.current = setInterval(() => {
        console.log('WebSocket connection is closed, reconnecting...');
        connectWebSocket();
      }, 5000); // 5 秒后尝试重新连接
    };
  }, [dispatch, ws]);
  useEffect(() => {
    // 初始化 WebSocket 连接
    connectWebSocket();

    return () => {
      console.log('WebSocket cleaned');
      // 清理 WebSocket 和定时器
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      if (reconnectTimerRef.current) {
        clearInterval(reconnectTimerRef.current);  // 清理重连定时器
      }
    };
  }, [connectWebSocket, ws]);  // 只在组件挂载时触发一次，不需要依赖 `ws` 和 `dispatch`

  console.log('websocket before value ', ws);
  const webSocketContext = {
    webSocketRef: ws,
  };
  return (
    <WebSocketContext.Provider value={webSocketContext}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(WebSocketContext);
};
