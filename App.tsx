import React, {useEffect} from 'react';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { LoginUsingStorageInfo } from './src/initApp';
import {Home as HomeScreen} from '@/screens/Home';
import {ChatListScene, ChatScreen, ChatSettingScreen} from '@/screens/UIKitScreen';
import {Login as LoginScreen} from '@/screens/Login';
import {DocScreen} from '@/screens/UIKitScreen/DocScreen';
import {AuthGuard} from '@/components/functional/AuthGuard';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserInfo} from '@/store/modules/User.ts';
import {RootState} from '@/store';
import {Setting} from '@/screens/Setting';
import {useWebSocketManager} from '@/components/functional/WebSocketManager';
import {AppNavigator} from '@/navigations/AppNavigator';
import {useMessageManager} from '@/components/functional/MessageManager';
import {createTable} from '@/utils/database.ts';

// import { RootState } from './src/store';

function App(): React.JSX.Element {
  createTable();
  // 在根组件中初始化 WebSocket 连接
  const { handleReceivedMessage } = useMessageManager();
  useWebSocketManager(handleReceivedMessage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  const {userInfo} = useSelector((state: RootState) => state.user);
  return (
    <AppNavigator />
  );
}

export default App;
