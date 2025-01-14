import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ChatListProvider} from '@/components/context';
import {ChatList} from '@/components/ui/ChatList';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useMessengerContext} from '@/components/context/MessengerContext.tsx';

export const ChatListScene = () => {
  const {conversations} = useSelector((state: RootState) => state.conversation);
  const {onPressConversation} = useMessengerContext();
  return (
    <View style={styles.chatListContainer}>
      <ChatListProvider>
        <ChatList
          onPressConversation={onPressConversation}
          conversations={conversations}
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
