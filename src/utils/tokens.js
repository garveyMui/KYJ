import {MMKV} from 'react-native-mmkv';

const JWT_KEY = 'jwtToken';
const storage = new MMKV();
function setToken(token, key = JWT_KEY) {
  // AsyncStorage.setItem(key, token);
  storage.set(key, token);
}

function getToken(key = JWT_KEY) {
  // return AsyncStorage.getItem(key);
  storage.getString(key);
}

function removeToken(key = JWT_KEY) {
  // AsyncStorage.removeItem(key).catch(error => console.log(error));
  storage.delete(key);
}

export { setToken, getToken, removeToken };
