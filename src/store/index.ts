import {configureStore} from '@reduxjs/toolkit';
import messagesReducer from './modules/Messages';
import socketStatusReducer from './modules/Socket';
import chatObjectReducer from './modules/ChatObject.ts';
import conversationReducer from './modules/Conversation';
import userReducer from './modules/User';
import contactsReducer from './modules/Contacts';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    socket: socketStatusReducer,
    chatObject: chatObjectReducer,
    conversation: conversationReducer,
    user: userReducer,
    contacts: contactsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
