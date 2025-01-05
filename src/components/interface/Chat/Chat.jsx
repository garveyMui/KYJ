import React, {useCallback, useEffect, useState} from 'react';

import {IRouterParams} from '@/interface';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {MessageList} from '../MessageList';
import {ChatHeader} from '../ChatHeader';
import {MessageInput} from '../MessageInput';
import {MessageInputProvider, useChatContext} from '../../context';

const windowHeight = Dimensions.get('window').height;
export const Chat = ({ navigation }: IRouterParams) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };
  const {
    contentOffset,
    inputHeight,
    setInputHeight,
    handleScrollToEnd,
  } = useChatContext();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const [layout, setLayout] = useState({
    headerHeight: 0,
    contentHeight: 0,
    listHeight: 0,
    inputHeight: 0,
  });
  const {id: sender, name, avatar} = useSelector((state: RootState) => state.chatObject);
  const {conversationId} = useSelector((state: RootState) => state.chatObject);
  const chatObject = {
    id: sender,
    name,
    avatar,
  };

  const updateLayout = useCallback(() => {
    const listHeight = layout.contentHeight - inputHeight - contentOffset;
    setLayout((prev) => ({ ...prev, listHeight }));
  }, [layout.contentHeight, layout.headerHeight, inputHeight, contentOffset]);
  const handleHeaderLayout = useCallback((e)=> {
    const headerHeight = e.nativeEvent.layout.height;
    setLayout((prev) => ({...prev, headerHeight}));
  },[]);
  const handleContentLayout = useCallback((e) => {
    const contentHeight = e.nativeEvent.layout.height;
    setLayout((prev) => ({ ...prev, contentHeight }));
  }, []);
  const handleInputLayout = useCallback((e) => {
    const inputHeight = e.nativeEvent.layout.height;
    setLayout((prev) => ({ ...prev, inputHeight }));
  }, []);

  useEffect(() => {
    updateLayout();
  }, [layout.contentHeight, layout.headerHeight, inputHeight, contentOffset, setLayout, updateLayout]);
  useEffect(() => {
    handleScrollToEnd();
  },[handleScrollToEnd, layout.listHeight]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.chatHeaderContainer}
        onLayout={handleHeaderLayout}
      >
        <ChatHeader
          navigateBack={navigateBack}
          navigateToChatSetting={navigateToChatSetting}
          chatObject={chatObject}
        />
      </View>
      <View
        style={[styles.contentContainer, {bottom: contentOffset, height: 900}]}
        onLayout={handleContentLayout}
      >
        <View style={[styles.messagesListContainer, {bottom: layout.inputHeight, height: 600}]}>
          <MessageList conversationId={conversationId} />
        </View>
        <View
          style={styles.inputContainer}
          onLayout={handleInputLayout}
          >
          <MessageInputProvider >
            <MessageInput />
          </MessageInputProvider>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    // backgroundColor: '#1F1F1F',
    // borderColor: '#1F1F1F',
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
