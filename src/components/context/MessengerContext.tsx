import React, {useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {ChatObject, setChatObject} from '@/store/modules/ChatObject.ts';
import {MessageInterface, setMessage} from '@/store/modules/Messages.ts';
import {updateConversation} from '@/store/modules/Conversations.ts';
import {markConversationAsRead} from '@/utils/database.ts';
import {useNavigation} from '@react-navigation/native';

interface IProps {
  children: React.ReactNode;
}

interface MessengerContextType {
  onPressConversation: (chatObject: ChatObject, conversationId: string, messages: MessageInterface[]) => void;
}


export const MessengerContext = React.createContext<MessengerContextType|undefined>(undefined);
export const MessengerContextProvider: React.FC<IProps> = ({ children }) => {
  const dispatch = useDispatch();
  const {conversations} = useSelector((state: RootState) => state.conversation);
  const navigation = useNavigation();
  const onPressConversation = (
    chatObject: ChatObject,
    conversationId: string,
    messages: MessageInterface[],
  ) => {
    dispatch(setChatObject({...chatObject, conversationId}));
    dispatch(setMessage(messages));
    const updatedConversation = JSON.parse(JSON.stringify(conversations[conversationId]));
    updatedConversation.unreadCountTotal = 0;
    dispatch(updateConversation(updatedConversation));
    navigation.navigate('Chat');
    markConversationAsRead(conversationId);
  };
  const messengerContext = {
    onPressConversation,
  };

  return (
    <MessengerContext.Provider value={messengerContext}>
      {children}
    </MessengerContext.Provider>
  );
};

export const useMessengerContext = (): MessengerContextType => {
  const contextValue = useContext(MessengerContext);
  if (!contextValue) {
    throw new Error('Context not found')
  }
  return contextValue;
};
