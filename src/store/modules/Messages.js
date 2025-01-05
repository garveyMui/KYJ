import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {postMessageAPI} from '@/apis/messages';
import {webSocket} from '@/utils/webSocket';
import {postAttachAPI} from '@/apis/attachments';

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

const postMessage = (message, callbacks) => {
  return async dispatch => {
    dispatch(addMessage(message));
    callbacks.forEach(callback => callback());
    await _postMessage(message);
  };
};

const _postMessage = async message => {
  try {
    const formData = new FormData();
    formData.append('message', message);
    let response = null;
    let result = null;
    switch (message.content.type) {
      case 'text':
        await postMessageAPI(JSON.stringify(message));
        break;
      case 'image':
        formData.append('image', {
          uri: message.content.uri,
          type: 'image/jpeg',
          name: message.content.fileName,
        });
        response = await postAttachAPI(formData);
        await postMessageAPI(
          JSON.stringify({
            ...message,
            content: {
              ...message.content,
              url: response.data.url,
            },
          }),
        );
        break;
      case 'file':
        formData.append('file', {
          uri: message.content.uri,
          type: message.content.mimeType || 'file/pdf',
          name: message.content.fileName,
        });
        response = await postAttachAPI(formData);
        await postMessageAPI(
          JSON.stringify({
            ...message,
            content: {
              ...message.content,
              url: response.data.url,
            },
          }),
        );
        result = response.json();
        break;
      default:
        console.error('Unsupported message type:', message.content.type);
        break;
    }
    return result.url;
  } catch (error) {
    throw error; // 抛出错误，以便可以在外部捕获
  }
};

export const {addMessage, removeMessage, setMessage} = messagesSlice.actions;

export {postMessage};

export default messagesSlice.reducer;
