import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesList: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messagesList.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.messagesList = state.messagesList.filter((message) => message.id !== action.payload);
    },
    setMessage: (state, action) => {
      state.messagesList = action.payload;
    },
  },
});

const postMessage = (message, callbacks) => {
  const URL = "http://localhost:8000/messages/" + message.id;
  return async (dispatch) => {
    // const res = await axios.post(URL, message);
    try {
      // const res = await axios.post(URL, message);
      dispatch(addMessage(message));
      // 如果有回调函数，则执行它们
      callbacks.forEach(callback => callback());
    } catch (error) {
      // 处理错误，例如可以在这里调用回调函数
      callbacks.forEach(callback => callback(error));
      throw error; // 抛出错误，以便可以在外部捕获
    }
  };
};


export const {
  addMessage,
  removeMessage,
  setMessage,
} = messagesSlice.actions;

export { postMessage };

export default messagesSlice.reducer;
