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

interface Props {
  onChangeText: (text: string) => void;
}
const InputBar:React.FC<Props> = ({onChangeText}) => {
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
        onChangeText={(text)=>{
          setText(text);
          onChangeText && onChangeText(text);
        }}
        value={text}
        placeholder="输入消息..."
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
          <AntDesign name="camera" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleChooseFile} style={styles.button}>
          <AntDesign name="folder1" size={24} color="orange" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleChooseImage} style={styles.button}>
          <AntDesign name="picture" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    flex: 1,
    flexBasis: '80%',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
  },
  button: {
    marginLeft: 10,
  },
});


export default InputBar;
