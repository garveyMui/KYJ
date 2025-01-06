import {createSlice} from '@reduxjs/toolkit';
import {request} from '@/utils/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setToken as _setToken, getToken, removeToken} from '@/utils';
import {logginAPI, getProfileAPI} from '@/apis/user';

interface Status {
  online: boolean; // 是否在线
  lastSeen: string | null; // 最近在线时间，ISO 8601 格式，或 null 表示未知
  statusMessage?: string; // 状态消息，可选
}

export interface User {
  id: string;           // 用户ID
  name: string;         // 用户名
  avatar: string;       // 用户头像
  status: Status; // 在线状态
}

const UserSlice = createSlice({
  name: 'User',
  initialState: {
    token: getToken('jwtToken') || '',
    userInfo: {},
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      _setToken('jwtToken', action.payload);
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = {};
      state.token = '';
      removeToken('jwtToken');
    },
  },
});

export const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const response = await logginAPI(loginForm);
    dispatch(setToken(response.data.token));
  };
};

export const fetchUserInfo = () => {
  return async (dispatch) => {
    const response = await getProfileAPI();
  };
};

export const { setToken, setUserInfo, clearUserInfo } = UserSlice.actions;

export default UserSlice.reducer;
