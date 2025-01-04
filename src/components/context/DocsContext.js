import {createContext, useContext, useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export const DocsContext = createContext();

export const DocsContextProvider = ({ children }) => {

  const [contentOffset, setContentOffset] = useState(0);

  useEffect(() => {
    function onKeyboardWillShow(e) { // Remove type here if not using TypeScript
      setContentOffset(e.endCoordinates.height);
    }

    function onKeyboardWillHide() {
      setContentOffset(0);
    }

    const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardWillShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardWillHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const docsContext = {
    contentOffset,
  };
  return (
    <DocsContext.Provider value={docsContext}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocsContext = () => {
  return useContext(DocsContext);
}