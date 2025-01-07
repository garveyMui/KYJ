// ChatList.tsx
import React, {useMemo} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {ChatObject} from '@/store/modules/ChatObject.ts';
import _ from 'lodash';
import {useChatListContext} from '../../context';
import dayjs from 'dayjs';
import {Message} from '@/store/modules/Messages.ts';

const ChatList: React.FC<{ onPressConversation: (chatObject:ChatObject, conversationId:string) => void }> = ({ onPressConversation }) => {
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
      onPressConversation(conversationsRef.current.get(item.sender.id), item.conversationId);
    }}>
      <View style={styles.messageContainer}>
        <View style={styles.leftSide}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />
            {item?.unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{item?.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rightSide}>
          <View style={styles.topRow}>
            <Text style={styles.sender}>
              {conversationsRef.current.get(item.sender.id)?.nickname}
            </Text>
            <Text style={styles.timestamp}>
              {dayjs(new Date(item.timestamp)).format('HH:mm')}
            </Text>
          </View>
          <Text style={styles.message}>
            {item.content.type === 'text' ? item.content.text : `[${item.content.type}]`}
          </Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  rightSide: {
    marginLeft: 10,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sender: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
  message: {
    color: '#333',
    marginTop: 5,
  },
});

export {ChatList};
