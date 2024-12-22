import {createContext, useContext, useRef} from 'react';

export const ChatListContext = createContext();

export const ChatListProvider = ({ children }) => {
  const conversationMap = new Map();
  conversationMap.set("user456", {
    id: "user456",
    name: "Bob",
    "avatar": "",
  });
  conversationMap.set("user123", {
    id: "user123",
    name: "Alice",
    "avatar": "",
  });
  const conversationsRef = useRef(conversationMap);
  const conversationContext = {
    conversationsRef,
  };
  // console.log('conversationContext', conversationContext);
  return (
    <ChatListContext.Provider value={conversationContext}>
      {children}
    </ChatListContext.Provider>
  );
}

export const useChatListContext = () => {
  return useContext(ChatListContext);
};
