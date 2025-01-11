// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home as HomeScreen } from '@/screens/Home';
import { ChatListScene, ChatScreen, ChatSettingScreen } from '@/screens/UIKitScreen';
import { Login as LoginScreen } from '@/screens/Login';
import { DocScreen } from '@/screens/UIKitScreen/DocScreen';
import { Setting } from '@/screens/Setting';
import { AuthGuard } from '@/components/functional/AuthGuard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '@/store/modules/User.ts';
import { RootState } from '@/store';
import { useWebSocketManager } from 'src/components/functional/WebSocketManager';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, gestureEnabled: true }} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            statusBarTranslucent: false,
            statusBarBackgroundColor: 'white',
          }}
        />
        <Stack.Screen name="Login" options={{ headerShown: true, gestureEnabled: true }}>
          {(props: any) => (
            <AuthGuard navigation={props.navigation}>
              <LoginScreen {...props} />
            </AuthGuard>
          )}
        </Stack.Screen>
        <Stack.Screen name="Docs" component={DocScreen} options={{ headerShown: true, gestureEnabled: true }} />
        <Stack.Screen name="Messenger" component={ChatListScene} options={{ headerShown: true, gestureEnabled: true }} />
        <Stack.Screen name="ChatSetting" component={ChatSettingScreen} options={{ headerShown: true, gestureEnabled: true }} />
        <Stack.Screen name="Setting" component={Setting} options={{ headerShown: true, gestureEnabled: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export {AppNavigator};
