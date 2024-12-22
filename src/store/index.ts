import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './modules/Messages';
import socketStatusReducer from './modules/Socket';
import chatObjectReducer from './modules/ChatObject.ts';
import conversationReducer from './modules/Conversation';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    socket: socketStatusReducer,
    chatObject: chatObjectReducer,
    conversation: conversationReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
