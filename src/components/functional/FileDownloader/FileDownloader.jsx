import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import * as Progress from 'react-native-progress';

const FileDownloader = () => {
  const [progress, setProgress] = useState(0); // 下载进度
  const [isDownloading, setIsDownloading] = useState(false); // 下载状态

  const downloadFile = async () => {
    const url = 'https://example.com/file-to-download.pdf'; // 替换为你的文件 URL
    const filePath = `${RNFS.DocumentDirectoryPath}/downloaded-file.pdf`;

    setIsDownloading(true);

    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      progress: res => {
        // 计算进度百分比
        const percentage = res.bytesWritten / res.contentLength;
        setProgress(percentage);
      },
      progressDivider: 10, // 每写入10%的内容触发一次进度更新
    })
      .promise.then(result => {
        if (result.statusCode === 200) {
          console.log('File downloaded successfully:', filePath);
          setIsDownloading(false);
          setProgress(0); // 重置进度条
        } else {
          console.error('File download failed:', result.statusCode);
        }
      })
      .catch(err => {
        console.error('File download error:', err);
        setIsDownloading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Downloader</Text>

      {isDownloading ? (
        <Progress.Bar progress={progress} width={300} />
      ) : (
        <Button title="Download File" onPress={downloadFile} />
      )}

      {isDownloading && (
        <Text style={styles.progressText}>
          Progress: {(progress * 100).toFixed(2)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default FileDownloader;
