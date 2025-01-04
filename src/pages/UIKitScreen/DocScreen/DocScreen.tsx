import React, {useEffect, useState} from 'react';
import {IRouterParams} from '../../../interface';
import {Dimensions, Keyboard, StyleSheet, View} from 'react-native';
import {Docs} from '../../../components/interface/Docs';
import {DocsContextProvider} from '@/components/context/DocsContext';

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
      <DocsContextProvider>
        <Docs navigation={navigation} />
      </DocsContextProvider>
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
