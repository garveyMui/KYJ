import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMessageInputContext} from '../../context/MessageInputContext';

export const FileUploadPreview = () => {
  const {filesToUpload, removeFile, uploadFile, uploadFiles} =
    useMessageInputContext();
  const [isUploading, setIsUploading] = useState(false);

  // const handleUpload = async () => {
  //   setIsUploading(true);
  //   try {
  //     await uploadFiles();
  //   } catch (error) {
  //     console.error('Error uploading files:', error);
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };
  // console.log(filesToUpload);
  return (
    <View style={styles.container}>
      {filesToUpload && filesToUpload.length > 0 ? (
        filesToUpload.map(file => (
          <View key={file.uri} style={styles.fileContainer}>
            <Text>{file.name}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFile(file.uri)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
            {file.state === 'uploading' && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => uploadFile(file.id)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noFileText}>No files uploaded</Text>
      )}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={uploadFiles}
        disabled={isUploading}>
        <Text style={styles.sendText}>Send All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  fileContainer: {
    position: 'relative',
    margin: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
  },
  retryButton: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
  },
  noFileText: {
    color: '#888',
    fontSize: 14,
  },
  sendButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 128, 0, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  sendText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default FileUploadPreview;
