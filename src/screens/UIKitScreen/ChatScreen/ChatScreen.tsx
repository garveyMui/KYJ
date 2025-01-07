import React, {useEffect, useState} from 'react';
import {Chat} from '@/components/ui/Chat';
import {IRouterParams} from '../../../interface';
import {Dimensions, Keyboard, StatusBar, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {ChatContextProvider} from '../../../components/context';

const windowHeight = Dimensions.get('window').height;
export const ChatScreen = ({navigation}: IRouterParams) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };

  const {
    id: sender,
    name,
    avatar,
  } = useSelector((state: RootState) => state.chatObject);
  const {conversationId} = useSelector((state: RootState) => state.chatObject);
  const chatObject = {
    id: sender,
    name,
    avatar,
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false} // 不透明
        backgroundColor="#ffffff" // 状态栏背景颜色（iOS 会通过 SafeAreaView 设置）
        barStyle="dark-content" // 状态栏文字和图标颜色
      />
      <ChatContextProvider>
        <Chat navigation={navigation} />
      </ChatContextProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    // backgroundColor: '#1F1F1F',
  },
  contentContainer: {
    position: 'relative',
    flex: 1,
    height: windowHeight,
    borderStyle: 'solid',
    borderColor: 'red',
    borderWidth: 1,
  },
  inputContainerWithKeyboard: {
    marginBottom: 300,
  },
  messagesListContainer: {
    // flex: 0,
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
  },
  inputContainer: {
    position: 'absolute',
    // bottom: -20,
    zIndex: 100,
    borderColor: 'green',
    borderWidth: 1,
    width: '100%',
  },
});
