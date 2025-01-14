import {FlatList, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {MessageItem} from '../MessageItem';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useChatContext} from '../../context';

const MessageList: React.FC<Props> = ({conversationId}) => {
  const {messagesList} = useSelector((state: RootState) => state.messages);
  const {messageListRef, inputHeight, contentHeight, handleScrollToEnd} =
    useChatContext();
  useEffect(() => {
    handleScrollToEnd();
  }, [messagesList, handleScrollToEnd]);
  return (
    <FlatList
      ref={messageListRef}
      style={[styles.container, {height: contentHeight - inputHeight}]}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      onContentSizeChange={() => handleScrollToEnd()}
      data={messagesList}
      renderItem={({item}) => (
        <TouchableWithoutFeedback onPress={() => {}}>
          <MessageItem message={item} isOwnMessage={item.sender.id === -1} />
        </TouchableWithoutFeedback>
      )}
      keyExtractor={item => item.messageId.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // height: '89%',
    flex: 1,
    width: '100%',
    // backgroundColor: '#1F1F1F',
  },
});

interface Props {
  conversationId: string | null;
}


export {MessageList};
