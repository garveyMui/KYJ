import {FlatList, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {MessageItem} from '../MessageItem';
import {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DocsList = () => {
  const {docsList} = useSelector((state: RootState) => state.messages);
  // const {messageListRef, inputHeight, contentHeight, handleScrollToEnd} = useChatContext();
  // useEffect(() => {
  //   handleScrollToEnd();
  // }, [chatRecords, handleScrollToEnd]);
  const contentHeight = 500;
  const inputHeight = 50;
  const [downloadedFiles, setDownloadedFiles] = useState([]);

  useEffect(() => {
    const fetchCache = async () => {
      const cachedFiles =
        JSON.parse(await AsyncStorage.getItem('downloadedFiles')) || [];
      setDownloadedFiles(cachedFiles);
    };

    fetchCache();
  }, []);

  return (
    <FlatList
      // ref={messageListRef}
      style={[styles.container, {height: contentHeight - inputHeight}]}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      data={docsList}
      renderItem={({item}) => (
        <TouchableWithoutFeedback onPress={() => {}}>
          <MessageItem message={item} isOwnMessage={false} />
        </TouchableWithoutFeedback>
      )}
      keyExtractor={item => item.messageId.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // height: '89%',
    width: '100%',
    // backgroundColor: '#1F1F1F',
  },
});

interface Props {
  conversationId: string | null;
}

interface Message {
  messageId: string;
  conversationId: string | null;
  sender: {
    id: string;
    name: string;
  };
  content: {
    text: string;
    type: string;
  };
}

export {DocsList};
