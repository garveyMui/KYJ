import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {

  const messageListRef = useRef(null);
  const handleScrollToEnd = () => {
    const timer = setTimeout(() => {
      messageListRef.current?.scrollToEnd({animated: true});
      console.log('scrollToEnd');
    }, 10); // 延迟执行，确保布局完成
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [contentOffset, setContentOffset] = useState(0);
  const [inputHeight, setInputHeight] = useState(300);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    function onKeyboardWillShow(e) { // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
      setContentOffset(e.endCoordinates.height);
      // handleScrollToEnd();
    }

    function onKeyboardWillHide() {
      setKeyboardHeight(0);
      setContentOffset(0);
      // handleScrollToEnd();
    }

    const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardWillShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardWillHide);
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