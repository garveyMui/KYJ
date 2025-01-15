import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ChatListProvider} from '@/components/context';
import {ChatList} from '@/components/ui/ChatList';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {Conversations} from '@/store/modules/Conversations.ts';
import {useMessengerContext} from '@/components/context/MessengerContext.tsx';

export const UnreadListScene = () => {
  const {conversations} = useSelector((state: RootState) => state.conversation);
  const {onPressConversation} = useMessengerContext();
  const unreadConversations: Conversations = {};
  Object.entries(conversations).forEach(([conversationId, conversation]) => {
    if (conversation.unreadCountTotal > 0) {
      unreadConversations[conversationId] = conversation;
    }
  });
  return (
    <View style={styles.chatListContainer}>
      <ChatListProvider>
        <ChatList
          onPressConversation={onPressConversation}
          conversations={unreadConversations}
        />
      </ChatListProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  chatListContainer: {
    flex: 1,
  },
});
