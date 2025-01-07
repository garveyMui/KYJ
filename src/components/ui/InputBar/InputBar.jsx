import React, {useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { AntDesign } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useMessageInputContext} from '../../context';

const InputBar = () => {
  const {
    imageUploads,
    setImageUploads,
    handleChooseImage,
    handleChooseFile,
    handleTakePhoto,
    text,
    setText,
    handleSend,
  } = useMessageInputContext();
  const windowWidth = Dimensions.get('window').width;
  const inputRef = useRef(null);
  return (
    <View style={[styles.container, {width: windowWidth * 0.8}]}>
      <TextInput
        ref={inputRef}
        onFocus={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
        style={styles.textInput}
        editable={true}
        onChangeText={setText}
        value={text}
        placeholder="输入消息..."
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity onPress={handleTakePhoto} style={{marginLeft: 10}}>
        <AntDesign name="camera" size={24} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleChooseFile} style={{marginLeft: 10}}>
        <AntDesign name="folder1" size={24} color="orange" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleChooseImage} style={{marginLeft: 10}}>
        <AntDesign name="picture" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    // width: '60%',
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});


export default InputBar;
