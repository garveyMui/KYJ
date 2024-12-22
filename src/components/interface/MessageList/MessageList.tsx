import {FlatList, View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { MessageItem } from '../MessageItem';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';

const MessageList: React.FC<Props> = ({conversationId}) => {
  const {messagesList} = useSelector((state: RootState) => state.messages);
  const chatRecords = useMemo(():Array<Message> => {
    const getChatRecords = (): Array<Message> => {
      return messagesList.filter((item: Message) => item.conversationId === conversationId);
    };
    return getChatRecords();
  }, [messagesList, conversationId]);
  return (
    <FlatList style={styles.container}
              contentContainerStyle={{
                flexGrow: 1,
              }}
      data={chatRecords}
      renderItem={({item}) => (
        <TouchableWithoutFeedback onPress={()=>{}}>
          <MessageItem message={item} isOwnMessage={item.sender.id === '-1'} />
        </TouchableWithoutFeedback>
      )}
      keyExtractor={item => item.messageId.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: '89%',
    width: '100%',
    // backgroundColor: '#1F1F1F',
  },
});

interface Props {
  conversationId: string|null;
}

interface Message{
  messageId: string;
  conversationId: string|null;
  sender: {
    id: string;
    name: string;
  };
  content: {
    text: string;
    type: string;
  };
}

export { MessageList };
