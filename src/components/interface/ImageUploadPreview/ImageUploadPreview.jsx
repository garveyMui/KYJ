import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {useMessageInputContext} from '../../context/MessageInputContext';

// Custom ImageUploadPreview component
const ImageUploadPreview = () => {
  const { imageUploads, removeImage, uploadImage, uploadImages } = useMessageInputContext();
  return (
    <View style={styles.container}>
      {imageUploads && imageUploads.length > 0 ? (
        imageUploads.map((image) => (
          <View key={image.uri} >
            <Image
              source={{ uri: image.state === 'uploading' ? image.uri : image.uri }}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(image.uri)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
            {image.state === 'uploading' && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => uploadImage(image.id)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noImageText}>No images uploaded</Text>
      )}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={uploadImages}
      >
        <Text style={styles.sendText}>Send All</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the custom component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
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
  noImageText: {
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
});

export { ImageUploadPreview };
