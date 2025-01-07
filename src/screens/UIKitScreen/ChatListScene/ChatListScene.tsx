import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ChatListProvider} from '@/components/context';
import {ChatList} from '@/components/ui/ChatList';
import {ChatObject, setChatObject} from '@/store/modules/ChatObject.ts';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

export const ChatListScene = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onPressConversation = (
    chatObject: ChatObject,
    conversationId: string,
  ) => {
    if (chatObject.user.id !== '-1') {
      dispatch(setChatObject({...chatObject, conversationId}));
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
