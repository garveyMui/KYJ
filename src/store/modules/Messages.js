import {createSlice} from '@reduxjs/toolkit';
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
      state.messagesList = state.messagesList.filter(
        message => message.id !== action.payload,
      );
    },
    setMessage: (state, action) => {
      state.messagesList = action.payload;
    },
  },
});

const postMessage = (message, callbacks, webSocket) => {
  webSocket.send(JSON.stringify(message));
  const URL = 'http://localhost:4023/message/' + message.id;
  return async (dispatch) => {
    try {
      dispatch(addMessage(message));
      const formData = new FormData();
      formData.append('message', message);
      let response = null;
      let result = null;
      switch(message.content.type){
        case 'image':
          formData.append('image', {
            uri: message.content.uri,
            type: 'image/jpeg',
            name: message.content.fileName,
          });
          response = await axios.post(URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        case 'file':
          formData.append('file', {
            uri: message.content.uri,
            type: 'file/pdf',
            name: message.content.fileName,
          });
          response = await axios.post(URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          result = await response.json();
          break;
        case 'text':
          webSocket.send(JSON.stringify(message));
          break;
          default:
            console.error(message);
            break;
      }
      // 如果有回调函数，则执行它们
      callbacks.forEach(callback => callback());
      return result.url;
    } catch (error) {
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
