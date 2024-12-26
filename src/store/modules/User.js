import {createSlice} from '@reduxjs/toolkit';
import {request} from '@/utils/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setToken as _setToken, getToken, removeToken} from '@/utils';
import {logginAPI, getProfileAPI} from '@/apis/user';

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
