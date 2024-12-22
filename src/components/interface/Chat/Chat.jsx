import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ChatComponent = ({ opponentName, opponentAvatar, onBackPress, onSendPress, onMediaPress }) => {
  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Image source={{ uri: opponentAvatar }} style={styles.avatar} />
          <Text style={styles.userName}>{opponentName}</Text>
        </View>
      </View>

      {/* 聊天内容区域 */}
      {/* 这里可以放置消息列表组件，例如使用FlatList来渲染消息 */}

      {/* 底部输入框和功能按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onMediaPress} style={styles.mediaButton}>
          <Text style={styles.mediaButtonText}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          // onChangeText={(text) => setMessageText(text)}
          // value={messageText}
        />
        <TouchableOpacity onPress={onSendPress} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    // 根据需要调整样式
  },
  backButtonText: {
    fontSize: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 18,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  mediaButton: {
    // 根据需要调整样式
  },
  mediaButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
  },
  sendButton: {
    // 根据需要调整样式
  },
  sendButtonText: {
    fontSize: 16,
  },
});

export {ChatComponent};
