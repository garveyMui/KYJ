/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import { Provider } from 'react-redux';
// import { UIKitProvider } from '@tencentcloud/chat-uikit-react-native';
// import store from './src/store';
import React, {useEffect, useRef} from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { LoginUsingStorageInfo } from './src/initApp';
import { Home as HomeScreen } from './src/pages/Home';
import {setMessage} from './src/store/modules/Messages';
import {connect, disconnect, errorOccurred} from './src/store/modules/Socket';
import {useDispatch} from 'react-redux';
// import { RootState } from './src/store';

function App(): React.JSX.Element {
  // const {status: socket} = useSelector(state => state.socket);
  const Stack = createNativeStackNavigator();
  const navigationRef = useNavigationContainerRef();
  // useEffect(() => {
  //   LoginUsingStorageInfo(() => {
  //     navigationRef.navigate('Home');
  //   });
  // });
  const dispatch = useDispatch();
  const ws = useRef<WebSocket|null>(null);
  // const {isConnected} = useSelector((state:RootState) => state.socket);
  // 建立 WebSocket 连接
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket('ws://localhost:4023');

      ws.current.onopen = () => {
        console.log('WebSocket connection established');
        if (reconnectTimerRef.current) {
          clearInterval(reconnectTimerRef.current);
        }
        dispatch(connect()); // 保存 WebSocket 实例
      };

      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Received data: ', data);
        dispatch(setMessage(data.data)); // 更新状态以显示从服务器接收到的消息
      };

      ws.current.onerror = (e: {message: any}) => {
        console.log('WebSocket error:', e.message);
        dispatch(errorOccurred(e)); // 清除 WebSocket 实例
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        dispatch(disconnect()); // 清除 WebSocket 实例
        reconnectTimerRef.current = setInterval(()=>{
          console.log('web socket connection is closed, reconnecting...');
          connectWebSocket();
          }, 5000);
      };
    };
    // 在组件挂载时建立连接
    connectWebSocket();

    // 在组件卸载时断开连接
    return () => {
      if (reconnectTimerRef.current) {
        clearInterval(reconnectTimerRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [dispatch]);
  return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: true}}
        >
          {/*<Stack.Screen name="Login" component={LoginScreen} />*/}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false, gestureEnabled: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
