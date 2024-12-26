import {createSlice} from '@reduxjs/toolkit';

const Conversation = createSlice({
  name: 'conversation',
  initialState: {
    conversationId: null,
  },
  reducers: {
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
  },
});

export const { setConversationId } = Conversation.actions;

export default Conversation.reducer;
