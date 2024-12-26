import React, {createContext, useContext, useEffect, useState} from 'react';
import {postMessage} from '../../store/modules/Messages';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useChatContext} from './ChatContext';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {useSocketContext} from './SocketContext';

// Create the context
export const MessageInputContext = createContext();

// Context Provider component
export const MessageInputProvider = ({children}) => {
  const savePDFToDocuments = async () => {
    // 假设你的PDF文件名为example.pdf，并且它位于项目的根目录下的Resources文件夹中
    const pdfName =
      'NIPS-2012-imagenet-classification-with-deep-convolutional-neural-networks-Paper.pdf';
    const pdfPath = `${RNFS.MainBundlePath}/${pdfName}`;

    // 设定保存路径
    const documentsPath = RNFS.DocumentDirectoryPath;
    const savePath = `${documentsPath}/${pdfName}`;

    // 检查文件是否存在
    const exists = await RNFS.exists(savePath);
    if (exists) {
      // Alert.alert('文件已存在');
      return;
    }

    // 读取文件内容
    const fileContent = await RNFS.readFile(pdfPath, 'base64');

    // 写入文件到指定路径
    try {
      await RNFS.writeFile(savePath, fileContent, 'base64');
      Alert.alert('文件保存成功');
    } catch (error) {
      Alert.alert('保存文件失败', error.message);
    }
  };
  const {webSocketRef} = useSocketContext();
  console.log('websocket: ', webSocketRef.current);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [filePreviewVisible, setFilePreviewVisible] = useState(false);
  const [text, setText] = useState('');
  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [imagesUploaded, setImagesUploaded] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const chatObject = useSelector(state => state.chatObject);
  const dispatch = useDispatch();
  const {handleScrollToEnd} = useChatContext();
  const createMessage = (content, contentType, name = '') => {
    return {
      messageId: uuidv4(),
      content: {
        text: content,
        type: contentType,
        fileName: name,
      },
      sender: {
        id: '-1',
        name: 'user',
        avatar: require('../../assets/avatar.jpg'),
      },
      recipient: chatObject,
      conversationId: chatObject.conversationId,
      timestamp: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss') + 'Z',
    };
  };
  const uploadImage = async newImage => {
    const actionCreator = postMessage(createMessage(newImage.uri, 'image'), []);
    dispatch(actionCreator);
    return newImage;
  };
  const uploadFile = async file => {
    const actionCreator = postMessage(createMessage(file.uri, 'file', file.name), []);
    dispatch(actionCreator);
    return file;
  };
  const uploadImages = () => {
    setImagesUploaded([]);
    const uploadPromises = imagesToUpload.map(image => uploadImage(image));
    Promise.all(uploadPromises)
      .then(responses => {
        setImagesUploaded(responses);
        handleScrollToEnd();
      })
      .catch(error => {
        console.error('Upload failed:', error);
        // Handle the error appropriately
      });
  };
  const uploadFiles = () => {
    setFilesUploaded([]);
    const uploadPromises = filesToUpload.map(file => uploadFile(file));
    Promise.all(uploadPromises)
      .then(responses => {
        setFilesUploaded(responses);
        handleScrollToEnd();
      })
      .catch(error => {
        console.error('File upload failed:', error);
        // Handle the error appropriately
      });
  };
  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 0,
    };
    setImagesUploaded([]);
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let imageUri = response.uri || response.assets;
        setSelectedImages(imageUri);
        setImagesToUpload(imageUri);
        setImagePreviewVisible(true);
      }
    });
  };
  const handleChooseFile = async () => {
    try {
      setFilesUploaded([]);
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('Result : ' + JSON.stringify(result));
      setFilesToUpload(result);
      setFilePreviewVisible(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled');
      } else {
        throw err;
      }
    }
  };
  const handleSend = () => {
    // 处理发送文本的逻辑
    const actionCreator = postMessage(createMessage(text, 'text'), [
      () => {
        setText('');
      },
    ], webSocketRef.current);
    console.log('actionCreator: ', actionCreator);
    dispatch(actionCreator);
    handleScrollToEnd();
  };
  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
    // 处理拍照的逻辑
    console.log('拍照');
  };
  const removeImage = uri => {
    setImagesToUpload(imagesToUpload.filter(image => image.uri !== uri));
  };
  const removeFile = uri => {
    setFilesToUpload(filesToUpload.filter(file => file.uri !== uri));
  };
  useEffect(() => {
    savePDFToDocuments();
  }, []);
  useEffect(() => {
    if (imagesUploaded.length === imagesToUpload.length) {
      setImagesToUpload([]);
      setImagePreviewVisible(false);
    }
    if (imagesToUpload.length === 0) {
      setImagePreviewVisible(false);
    }
  }, [imagesUploaded, imagesToUpload.length]);
  useEffect(() => {
    console.log('file: ', filesUploaded.length);
    console.log(filesToUpload.length);
    if (filesUploaded.length === filesToUpload.length) {
      setFilesToUpload([]);
      setFilePreviewVisible(false);
    }
    if (filesToUpload.length === 0) {
      setFilePreviewVisible(false);
    }
  }, [filesUploaded, filesToUpload.length]);
  const messageInputContext = {
    removeImage,
    uploadImage,
    uploadImages,
    imageUploads: imagesToUpload,
    setImagesToUpload,
    handleChooseImage,
    handleChooseFile,
    handleTakePhoto,
    text,
    setText,
    handleSend,
    imagePreviewVisible,
    filePreviewVisible,
    uploadFiles,
    filesToUpload,
    filesUploaded,
    removeFile,
  };
  return (
    <MessageInputContext.Provider value={messageInputContext}>
      {children}
    </MessageInputContext.Provider>
  );
};

// Custom hook for easier access
const useMessageInputContext = () => {
  const contextValue = useContext(MessageInputContext);
  return contextValue;
};
export {useMessageInputContext};
