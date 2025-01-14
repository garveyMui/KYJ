import React, {createContext, useContext, useRef, ReactNode} from 'react';
import {useSelector} from 'react-redux';
import {Contact} from '@/store/modules/Contacts.ts';
import {ChatObject} from '@/store/modules/ChatObject.ts';


interface ConversationContextType {
  conversationsRef: React.RefObject<Map<string, ChatObject>>;
}

export const ChatListContext = createContext<ConversationContextType | undefined>(undefined);

interface ChatListProviderProps {
  children: ReactNode;
}
export const ChatListProvider = ({ children }:ChatListProviderProps) => {
  const conversationMap = new Map<string, ChatObject>();
  const {contacts} = useSelector((state: any) => state.contacts);
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    conversationMap.set(contact.user.id, {
      user: contact.user,
      displayName: contact.nickname,
      conversationId: contact.conversationId,
    });
  }
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
};

export const useChatListContext = () => {
  return useContext(ChatListContext);
};
