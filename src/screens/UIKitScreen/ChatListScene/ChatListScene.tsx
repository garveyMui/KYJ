import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ChatListProvider} from '@/components/context';
import {ChatList} from '@/components/ui/ChatList';
import {ChatObject, setChatObject} from '@/store/modules/ChatObject.ts';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {MessageInterface, setMessage} from '@/store/modules/Messages.ts';
import {RootState} from '@/store';
import {ConversationInterface, setConversations} from '@/store/modules/Conversations.ts';

export const ChatListScene = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {conversations} = useSelector((state: RootState) => state.conversation);
  const onPressConversation = (
    chatObject: ChatObject,
    conversationId: string,
    messages: MessageInterface[],
  ) => {
    console.log('uid', chatObject.user.id);
    if (chatObject.user.id !== '-1') {
      dispatch(setChatObject({...chatObject, conversationId}));
      dispatch(setMessage(messages));
      // 深拷贝 conversations 并更新未读消息计数
      const updatedConversations = { ...conversations };
      if (updatedConversations[conversationId]) {
        updatedConversations[conversationId] = {
          ...updatedConversations[conversationId],
          unreadCountTotal: 0,
        };
      }

      dispatch(setConversations(updatedConversations));
    }
    navigation.navigate('Chat');
  };
  return (
    <View style={styles.chatListContainer}>
      <ChatListProvider>
        <ChatList onPressConversation={onPressConversation} />
      </ChatListProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  chatListContainer: {
    flex: 1,
  },
});
