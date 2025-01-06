import {useMessageInputContext} from '../../context';
import {StyleSheet, View} from 'react-native';
import {ImageUploadPreview} from '../ImageUploadPreview';
import InputBar from '../InputBar/InputBar';
import {FileUploadPreview} from '../FileUploadPreview';

const MessageInput = () => {
  const {imagePreviewVisible, filePreviewVisible} = useMessageInputContext();

  return (
    <View style={styles.container}>
      <View>
        <InputBar />
      </View>
      {imagePreviewVisible && <ImageUploadPreview />}
      {filePreviewVisible && <FileUploadPreview />}
    </View>
  );
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
    backgroundColor: 'white',
    width: '100%',
    // backgroundColor: '#1F1F1F',
  },
});

export { MessageInput };
