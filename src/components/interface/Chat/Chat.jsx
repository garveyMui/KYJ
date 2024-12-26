import React from 'react';

import {IRouterParams} from '@/interface';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
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
  // const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {
    keyboardHeight,
    setKeyboardHeight,
    contentOffset,
    setContentOffset,
    setInputHeight,
    setContentHeight,
    contentHeight,
  } = useChatContext();
  console.log('keyboardHeight', keyboardHeight);

  const {id: sender, name, avatar} = useSelector((state: RootState) => state.chatObject);
  const {conversationId} = useSelector((state: RootState) => state.chatObject);
  const chatObject = {
    id: sender,
    name,
    avatar,
  };
  const handleInputLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    setInputHeight(height);
  };
  const handleContentLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };
  return (
    <View style={styles.container}>
      <View style={{zIndex: 100}}>
        <ChatHeader
          navigateBack={navigateBack}
          navigateToChatSetting={navigateToChatSetting}
          chatObject={chatObject}
        />
      </View>
      <View
        style={[styles.contentContainer, {bottom: contentOffset}]}
        onLayout={handleContentLayout}
      >
        <View style={styles.messagesListContainer}>
          <MessageList conversationId={conversationId} />
        </View>
        <View style={[styles.inputContainer, {bottom: 0}]} onLayout={handleInputLayout}>
          <MessageInputProvider >
            <MessageInput />
          </MessageInputProvider>
        </View>
      </View>
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

  messagesListContainer: {
    // flex: 0,
    position: 'absolute',
    top: 0,
    // height: '100%',
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
