import {createSlice} from '@reduxjs/toolkit';

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
    id: 'LLM',
    displayName: 'nickname',
    avatar: 'avatar',
    conversationId: 'LLM',
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
