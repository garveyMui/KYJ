import React, {useEffect, useState} from 'react';
import {Chat} from '../../../components/interface/Chat';
import {IRouterParams} from '../../../interface';
import {Dimensions, Keyboard, StyleSheet, View} from 'react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleKeyboardWillShow = event => {
    setKeyboardHeight(event.endCoordinates.height);
  };

  const handleKeyboardWillHide = () => {
    setKeyboardHeight(0);
  };
  useEffect(() => {
    const keyboardWillShowSubscription = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardWillShow,
    );
    const keyboardWillHideSubscription = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardWillHide,
    );

    return () => {
      keyboardWillShowSubscription.remove();
      keyboardWillHideSubscription.remove();
    };
  }, []);
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
