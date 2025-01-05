import React, {useEffect} from 'react';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { LoginUsingStorageInfo } from './src/initApp';
import {Home as HomeScreen} from './src/pages/Home';
import {ChatListScreen, ChatScreen, ChatSettingScreen} from './src/pages/UIKitScreen';
import {Login as LoginScreen} from './src/pages/Login';
import {DocScreen} from '@/pages/UIKitScreen/DocScreen';
import {AuthGuard} from '@/components/functional/AuthGuard';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserInfo} from '@/store/modules/User';
import {RootState} from '@/store';
import {Setting} from '@/pages/Setting';

// import { RootState } from './src/store';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  const navigationRef = useNavigationContainerRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  const {userInfo} = useSelector((state: RootState) => state.user);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: true}}>
        {/*<Stack.Screen name="Login" component={LoginScreen} />*/}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false, gestureEnabled: true}}
        />
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
        <Stack.Screen
          name="Login"
          // component={LoginScreen}
          options={{headerShown: true, gestureEnabled: true}}>
          {(props: any) => (
            <AuthGuard navigation={props.navigation}>
              <LoginScreen {...props} />
            </AuthGuard>
          )
          }
        </Stack.Screen>
        <Stack.Screen
          name="Docs"
          component={DocScreen}
          options={{headerShown: true, gestureEnabled: true}}
        />
        <Stack.Screen
          name="Messenger"
          component={ChatListScreen}
          options={{headerShown: true, gestureEnabled: true}}
        />
        {/*<Stack.Screen*/}
        {/*  name="Contacts"*/}
        {/*  component={ChatScreen}*/}
        {/*  options={{headerShown: true, gestureEnabled: true}}*/}
        {/*/>*/}
        <Stack.Screen
          name="ChatSetting"
          component={ChatSettingScreen}
          options={{headerShown: true, gestureEnabled: true}}
        />
        {/*<Stack.Screen*/}
        {/*  name="About"*/}
        {/*  component={ChatScreen}*/}
        {/*  options={{headerShown: true, gestureEnabled: true}}*/}
        {/*/>*/}
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{headerShown: true, gestureEnabled: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
