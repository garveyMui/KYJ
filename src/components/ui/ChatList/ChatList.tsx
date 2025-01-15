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
import {ChatObject} from '@/store/modules/ChatObject.ts';
import {useChatListContext} from '../../context';
import dayjs from 'dayjs';
import {MessageInterface} from '@/store/modules/Messages.ts';
import {ConversationInterface} from '@/store/modules/Conversations.ts';
import _ from 'lodash';

const ChatList: React.FC<{
  onPressConversation: (
    chatObject: ChatObject,
    conversationId: string,
    messages: MessageInterface[],
  ) => void;
  conversations: Record<string, ConversationInterface>;
}> = ({onPressConversation, conversations}) => {
  // const {conversations} = useSelector((state: RootState) => state.conversation);
  console.log('conversations', conversations);
  const sessionList = useMemo(() => {
    console.log('conversations', conversations);
    return _.orderBy(
      Object.values(conversations).filter(item=>item.conversationId !== 'LLM'),
      ['lastUpdateTime'],
      ['desc'],
    );
  }, [conversations]);
  const {conversationsRef} = useChatListContext();
  // console.log('conversationRef', conversationsRef.current);
  const renderItem = ({item}: {item: ConversationInterface}) => (
    <TouchableOpacity
      onPress={() => {
        console.log('chatObject clicked', item.chatObject);
        onPressConversation(
          // conversationsRef.current.get(item.lastMessage.sender.id),
          item.chatObject,
          item.conversationId,
          _.orderBy(item.messages, ['timestamp', 'asc']),
        );
      }}>
      <View style={styles.messageContainer}>
        <View style={styles.leftSide}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: item.chatObject.avatar}}
              style={styles.avatar}
            />
            {item?.unreadCountTotal > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{item?.unreadCountTotal}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.rightSide}>
          <View style={styles.topRow}>
            <Text style={styles.sender}>
              {/*{conversationsRef.current.get(item.lastMessage.sender.id)?.nickname}*/}
              {item.chatObject.displayName}
            </Text>
            <Text style={styles.timestamp}>
              {dayjs(new Date(item.lastUpdateTime)).format('HH:mm')}
            </Text>
          </View>
          <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
            {item.lastMessageAbstract}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessionList}
        renderItem={renderItem}
        keyExtractor={item => item.conversationId.toString()}
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
