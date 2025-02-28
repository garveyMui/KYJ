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
import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
// polyfillFetch();

const RootComponent = () => {

  return (
    <Provider store={store}>
      <App />
    </Provider>
    );
};

AppRegistry.registerComponent(appName, () => {return RootComponent;});
