import React, {useState} from 'react';
import {Button, Image, StyleSheet, View} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const ImagePickerComponent = () => {
  const [images, setImages] = useState([]);

  const handleChoosePhoto = () => {
    const options = {
      // noData: true,
      mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options)
      .then(result => {
        setLocalImageAndVideoInfo(res.assets[0]);
      })
      .catch(err => {
        console.log(err);
      });

    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setImages([...images, response]);
      }
    });
  };

  const handleSendPhotos = () => {
    // 在这里实现发送图片的逻辑
    console.log('Sending images:', images);
    // 清空图片数组
    setImages([]);
  };

  return (
    <View style={styles.container}>
      <Button title="选择照片" onPress={handleChoosePhoto} />
      <View style={styles.imagesContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{uri: image.uri}} style={styles.image} />
        ))}
      </View>
      {images.length > 0 && (
        <Button title="发送图片" onPress={handleSendPhotos} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export {ImagePickerComponent};
