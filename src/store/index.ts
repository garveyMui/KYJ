import {configureStore} from '@reduxjs/toolkit';
import messagesReducer from './modules/Messages.ts';
import socketStatusReducer from './modules/Socket';
import chatObjectReducer from './modules/ChatObject.ts';
import conversationReducer from './modules/Conversations.ts';
import userReducer from './modules/User.ts';
import contactsReducer from './modules/Contacts.ts';
import BottomTabReducer from './modules/BottomTab';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    socket: socketStatusReducer,
    chatObject: chatObjectReducer,
    conversation: conversationReducer,
    user: userReducer,
    contacts: contactsReducer,
    bottomTab: BottomTabReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
