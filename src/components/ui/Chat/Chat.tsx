import React, {useEffect} from 'react';

import {IRouterParams} from '@/interface';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {MessageList} from '../MessageList';
import {ChatHeader} from '../ChatHeader';
import {MessageInput} from '../MessageInput';
import {MessageInputProvider, useChatContext} from '../../context';

const windowHeight = Dimensions.get('window').height;
export const Chat = ({navigation}: IRouterParams) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };
  const {contentOffset, handleScrollToEnd} =
    useChatContext();
  const {chatObject} = useSelector((state: RootState) => state);
  console.log('chatObject', chatObject);
  useEffect(() => {
    handleScrollToEnd();
  }, [handleScrollToEnd]);
  console.log('contentOffset', contentOffset);
  const {messagesList} = useSelector((state: RootState) => state.messages);
  return (
    <SafeAreaView style={[styles.outerContainer, { height: windowHeight - contentOffset }]}>
      <View style={styles.container}>
        <ChatHeader
          navigateBack={navigateBack}
          navigateToChatSetting={navigateToChatSetting}
          chatObject={chatObject}
        />
        <MessageList messagesList={messagesList}/>
        <MessageInputProvider>
          <MessageInput />
        </MessageInputProvider>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {

  },
  container: {
    flex: 1,
  },
  chatHeaderContainer: {
    zIndex: 100,
  },
  contentContainer: {
    position: 'relative',
    flex: 1,
    borderStyle: 'solid',
    borderColor: 'red',
    borderWidth: 1,
  },
  messagesListContainer: {
    position: 'absolute',
    // height: '100%',
    width: '100%',
  },
  inputContainer: {
    position: 'absolute',
    zIndex: 100,
    borderColor: 'green',
    borderWidth: 1,
    width: '100%',
    bottom: 0,
  },
});
