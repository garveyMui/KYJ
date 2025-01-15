import {useMessageInputContext} from '../../context';
import {StyleSheet, View} from 'react-native';
import {ImageUploadPreview} from '../ImageUploadPreview';
import InputBar from '../InputBar/InputBar.tsx';
import {FileUploadPreview} from '../FileUploadPreview';
interface Props {
  onChangeText: (text: string) => void;
}
const MessageInput: React.FC<Props> = ({onChangeText}) => {
  const {imagePreviewVisible, filePreviewVisible} = useMessageInputContext();

  return (
    <View style={styles.container}>
      <InputBar onChangeText={onChangeText}/>
      {imagePreviewVisible && <ImageUploadPreview />}
      {filePreviewVisible && <FileUploadPreview />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: 'auto',
  },
});

export { MessageInput };
