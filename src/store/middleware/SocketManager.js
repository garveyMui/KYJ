// 创建一个简单的中间件来处理 WebSocket
import {applyMiddleware, createStore} from 'redux';

const webSocketMiddleware = store => next => action => {
  if (action.type === 'CONNECT_SOCKET') {
    // 创建 WebSocket 实例
    const socket = new WebSocket(action.payload.url);

    // 绑定事件处理函数
    socket.onopen = () => store.dispatch({ type: 'SOCKET_OPEN' });
    socket.onclose = () => store.dispatch({ type: 'SOCKET_CLOSE' });
    socket.onmessage = event => store.dispatch({ type: 'SOCKET_MESSAGE', payload: event.data });
    socket.onerror = error => store.dispatch({ type: 'SOCKET_ERROR', payload: error });

    // 可以将 socket 存储在外部变量中，或者绑定到 window 对象上
    window.socket = socket;
  }

  return next(action);
};

function reducer() {

}

// 在创建 Redux store 时应用中间件
const store = createStore(reducer, applyMiddleware(webSocketMiddleware));
