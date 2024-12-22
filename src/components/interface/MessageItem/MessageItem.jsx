import React, { useState } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';

const MessageItem = ({ message, isOwnMessage }) => {
  console.log('MessageItem', message.content.text);
  const [showName, setShowName] = useState(false);

  const handlePress = () => {
    setShowName(!showName);
  };
  const renderMessageContent = () => {
    switch (message.content.type) {
      case 'text':
        return (
          <Text style={{ color: isOwnMessage ? '#111111' : '#333333', fontSize: 16 }}>
            {message.content.text}
          </Text>
        );
      case 'image':
        return (
          <Image
            source={{ uri: message.content.text }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        );
      case 'file':
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#888888', fontSize: 14 }}>{message.content.fileName}</Text>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => handleFileDownload(message.content.fileUrl)}
            >
              <Text style={{ color: '#007BFF', fontSize: 14 }}>下载</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const handleFileDownload = (fileUrl) => {
    // 处理文件下载逻辑
    console.log('下载文件:', fileUrl);
    // 在这里实现文件下载的逻辑
  };
  return (
    <TouchableOpacity onPress={handlePress} style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row', alignItems: 'center', padding: 10, margin: 5, borderRadius: 10, backgroundColor: isOwnMessage ? '#DCF8C6' : '#FFFFFF' }}>
      {!isOwnMessage && (
        <Image source={{ uri: message.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      )}
      <View style={{ flexDirection: 'column', marginLeft: isOwnMessage ? 10 : 0, marginRight: isOwnMessage ? 0 : 10 }}>
        {showName && (
          <Text style={{ color: '#888888', fontSize: 12 }}>{message.sender.name}</Text>
        )}
        {renderMessageContent()}
      </View>
    </TouchableOpacity>
  );
};

export {MessageItem};
