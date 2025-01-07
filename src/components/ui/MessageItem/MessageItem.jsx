import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageItem = ({message, isOwnMessage, onDownload = null}) => {
  console.log('MessageItem', message.content.text);
  const [showName, setShowName] = useState(false);

  const handlePress = () => {
    setShowName(!showName);
  };
  const renderMessageContent = () => {
    switch (message.content.type) {
      case 'text':
        return (
          <Text
            style={{color: isOwnMessage ? '#111111' : '#333333', fontSize: 16}}>
            {message.content.text}
          </Text>
        );
      case 'image':
        return (
          <Image
            source={{uri: message.content.text}}
            style={{width: 200, height: 200, borderRadius: 10}}
          />
        );
      case 'file':
        return (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#888888', fontSize: 14}}>
              {message.content.fileName}
            </Text>
            {!message.content.downloaded ? (
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => handleDownloadAndPreview(message)}>
                <Text style={{color: '#007BFF', fontSize: 14}}>Download</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => {
                  console.log('message.onPreview');
                }}>
                <Text style={{color: '#007BFF', fontSize: 14}}>Preview</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      default:
        return null;
    }
  };
  const previewFile = async filePath => {
    try {
      await FileViewer.open(filePath);
    } catch (err) {
      console.error('File preview error:', err);
    }
  };
  const handleDownloadAndPreview = async message => {
    if (!message.downloaded) {
      const localPath = await handleFileDownload(
        message.content.url,
        message.content.fileName,
      );
      message.content.localPath = localPath; // Update the message object
      message.content.downloaded = true; // Update state
    } else {
      await previewFile(message.localPath);
    }
  };
  const handleFileDownload = async (fileUrl, fileName) => {
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    try {
      const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // 下载文件
      const result = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localPath,
      }).promise;

      console.log(`File downloaded to: ${localPath}`);

      // 获取现有缓存
      const cachedFiles =
        JSON.parse(await AsyncStorage.getItem('downloadedFiles')) || [];

      // 更新缓存
      const newCache = [...cachedFiles, {fileName, localPath}];
      await AsyncStorage.setItem('downloadedFiles', JSON.stringify(newCache));

      console.log('File cache updated');
      return path;
    } catch (error) {
      console.error('Error downloading or caching file:', error);
    }
  };
  const clearCache = async () => {
    await AsyncStorage.removeItem('downloadedFiles');
    console.log('Cache cleared');
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius: 10,
        backgroundColor: isOwnMessage ? '#DCF8C6' : '#FFFFFF',
      }}>
      {!isOwnMessage && (
        <Image
          source={{uri: message.avatar}}
          style={{width: 40, height: 40, borderRadius: 20}}
        />
      )}
      <View
        style={{
          flexDirection: 'column',
          marginLeft: isOwnMessage ? 10 : 0,
          marginRight: isOwnMessage ? 0 : 10,
        }}>
        {showName && (
          <Text style={{color: '#888888', fontSize: 12}}>
            {message.sender.name}
          </Text>
        )}
        {renderMessageContent()}
      </View>
    </TouchableOpacity>
  );
};

export {MessageItem};
