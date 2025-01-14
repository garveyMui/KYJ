import {createSlice} from '@reduxjs/toolkit';
import {User} from './User';

interface ChatObject {
  // user?: User;
  id: string;
  displayName: string;
  avatar: string;
  conversationId: string;
}
const ChatObjectSlice = createSlice({
  name: 'ChatObject',
  initialState: {
    user: {
      id: '-1',
      name: 'user_name',
      avatar: 'avatar',
      status: {
        lastSeen: '',
        statusMessage: 'offline',
        online: false,
      },
    },
    id: '-1',
    displayName: 'nickname',
    avatar: 'avatar',
    conversationId: '',
  } as ChatObject,
  reducers: {
    setChatObject: (state, action) => {
      state.displayName = action.payload.displayName;
      state.conversationId = action.payload.conversationId;
    },
  },
});

export const {setChatObject} = ChatObjectSlice.actions;
export type {ChatObject};
export default ChatObjectSlice.reducer;
