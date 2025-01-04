import React, {useState} from 'react';

import {IRouterParams} from '../../../interface';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {DocsHeader} from '../DocsHeader';
import {DocsList} from '../DocsList';
import {AutoCompleteInput} from '../AutoCompleteInput';
import {DocsInputProvider} from '@/components/context';
import {useDocsContext} from '@/components/context/DocsContext';

const windowHeight = Dimensions.get('window').height;
export const Docs = ({ navigation }: IRouterParams) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };
  const {
    contentOffset,
  } = useDocsContext();

  const {id: sender, name, avatar} = useSelector((state: RootState) => state.chatObject);
  const {conversationId} = useSelector((state: RootState) => state.chatObject);
  const chatObject = {
    id: 0,
    name: 'ChatGPT',
    avatar,
  };

  return (
    <View style={styles.container}>
      <View style={{zIndex: 100}}>
        <DocsHeader
          navigateBack={navigateBack}
          navigateToChatSetting={navigateToChatSetting}
          chatObject={chatObject}
        />
      </View>
      <View
        style={[styles.contentContainer, {bottom: contentOffset}]}
      >
        <View style={styles.messagesListContainer}>
          <DocsList conversationId={conversationId} />
        </View>
        <View style={[styles.inputContainer, {bottom: 0}]} >
          <DocsInputProvider>
            <AutoCompleteInput />
          </DocsInputProvider>
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
