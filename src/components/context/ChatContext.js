import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {

  const messageListRef = useRef(null);
  const handleScrollToEnd = () => {
    messageListRef.current?.scrollToEnd({animated: true});
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [contentOffset, setContentOffset] = useState(0);
  const [inputHeight, setInputHeight] = useState(300);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    function onKeyboardDidShow(e) { // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
      setContentOffset(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
      setContentOffset(0);
    }

    const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const chatContext = {
    messageListRef,
    handleScrollToEnd,
    keyboardHeight,
    setKeyboardHeight,
    contentOffset,
    setContentOffset,
    inputHeight,
    setInputHeight,
    contentHeight,
    setContentHeight,
  };
  return (
    <ChatContext.Provider value={chatContext}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
}