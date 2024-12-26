// ChatList.tsx
import React, {useMemo} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {ChatObject} from '../../../store/modules/ChatObject.ts';
import _ from 'lodash';
import {useChatListContext} from '../../context';
import dayjs from 'dayjs';

interface Message {
  messageId: string;
  conversationId: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: {
    text: string;
    type: string;
  };
  timestamp: string;
}

const ChatList: React.FC<{ onPressConversation: (chatObject:ChatObject) => void }> = ({ onPressConversation }) => {
  const {messagesList} = useSelector((state: RootState) => state.messages);
  const sessionsList = useMemo(() => {
    const grouped = _.groupBy(messagesList, 'conversationId');
    const minValues = _.mapValues(grouped, group => _.maxBy(group, 'timestamp'));
    const result = _.values(minValues);
    return result;
  }, [messagesList]);
  // console.log('here:', messagesList[messagesList.length - 1]);
  const {conversationsRef} = useChatListContext();
  console.log('conversationRef', conversationsRef.current);
  const renderItem = ({item}: {item: Message}) => (
    <TouchableOpacity onPress={()=>{
      onPressConversation(conversationsRef.current.get(item.conversationId));
    }}>
      <View style={styles.messageContainer}>
        <Text style={styles.sender}>{conversationsRef.current.get(item.conversationId).name}</Text>
        <Text> {dayjs(new Date(item.timestamp)).format('HH:mm')} </Text>
        <Text style={styles.message}>{item.content.type==='text' && item.content.text || `[${item.content.type}]`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessionsList}
        renderItem={renderItem}
        keyExtractor={item => item.messageId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  messageContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    color: '#333',
  },
});

export {ChatList};
