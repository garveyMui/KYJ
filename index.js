/**
 * @format
 */
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/store';
import React from'react';
import {WebSocketProvider} from './src/components/context/SocketContext';
import {AuthGuard} from 'src/components/functional/AuthGuard';

const RootComponent = () => {
  return (
    <Provider store={store}>
      <WebSocketProvider>
          <App />
      </WebSocketProvider>
    </Provider>
    );
};

AppRegistry.registerComponent(appName, () => {return RootComponent;});
