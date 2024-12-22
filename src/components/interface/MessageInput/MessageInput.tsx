import { useMessageInputContext } from '../../context';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {ImageUploadPreview} from '../ImageUploadPreview';
import InputBar from '../InputBar/InputBar';


const MessageInput = ()=>{
  const context = useMessageInputContext();
  console.log('context: ', context);

  return (
    <View style={styles.container}>
      <View>
        <InputBar />
      </View>
      <ImageUploadPreview />
    </View>
  )
};


const styles = StyleSheet.create({
  flex: { flex: 1 },
  fullWidth: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    // backgroundColor: '#1F1F1F',
  },
});

export { MessageInput };
