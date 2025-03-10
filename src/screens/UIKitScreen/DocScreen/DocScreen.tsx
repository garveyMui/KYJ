import React from 'react';
import {IRouterParams} from '../../../interface';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Docs} from '@/components/ui/Docs';
import {DocsContextProvider} from '@/components/context/DocsContext';
import {ChatContextProvider} from '@/components/context';

const windowHeight = Dimensions.get('window').height;
export const DocScreen = ({navigation}: IRouterParams) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };
  return (
    <View style={styles.container}>
      {/*<DocsContextProvider>*/}
      <ChatContextProvider>
        <Docs navigation={navigation} />
      </ChatContextProvider>
      {/*</DocsContextProvider>*/}
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
