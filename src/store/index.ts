import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './modules/Messages';
import socketStatusReducer from './modules/Socket';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    socket: socketStatusReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
