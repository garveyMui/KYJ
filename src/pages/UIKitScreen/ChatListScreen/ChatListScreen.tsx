import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {ChatListProvider} from '@/components/context';
import {ChatList} from '@/components/interface/ChatList';
import {IRouterParams} from '@/interface.ts';
import {ChatObject, setChatObject} from '@/store/modules/ChatObject.ts';
import {useDispatch} from 'react-redux';

export const ChatListScreen = ({navigation}: IRouterParams) => {
  const dispatch = useDispatch();
  const onPressConversation = (chatObject: ChatObject) => {
    if (chatObject.id !== '-1') {
      dispatch(setChatObject(chatObject));
    }
    navigation.navigate('Chat');
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />

      <ChatListProvider>
        <ChatList onPressConversation={onPressConversation} />
      </ChatListProvider>
      {/*<ConversationList onPressConversation={onPressConversation} />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
