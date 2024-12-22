import React, {createContext, useContext, useEffect, useState} from 'react';
import {postMessage} from '../../store/modules/Messages';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Create the context
export const MessageInputContext = createContext();

// Context Provider component
export const MessageInputProvider = ({ children}) => {
  const [imageUploads, setImageUploads] = useState([]);
  const chatObject = useSelector((state) => state.chatObject);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState([]);
  const uploadImages = () => {
    for (let i = 0; i < imageUploads.length; i += 1) {
      uploadImage(imageUploads[i]).then((res) => {
        console.log('res: ', res);
        setLoaded([...loaded, res]);
      });
    }
  };
  useEffect(() => {
    if (loaded.length === imageUploads.length) {
      setImageUploads([]);
    }
  }, [imageUploads.length, loaded]);

  console.log('dayjs: ', dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'));

  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

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

  // const handleChooseFile = () => {
  //   console.log('选择文件');
  // };
  const createMessage = (content, contentType) => {
    return {
      messageId: uuidv4(),
      content: {
        text: content,
        type: contentType,
      },
      sender: {
        id: '-1',
        name: 'user',
        avatar: require('../../assets/avatar.jpg'),
      },
      recipient: chatObject,
      conversationId: chatObject.conversationId,
      timestamp: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')+'Z',
    };
  };
  const handleChooseFile = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        console.log(imageUri);
      }
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

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let imageUri = response.uri || response.assets;
        setSelectedImages(imageUri);
        console.log(imageUri);
        console.log(selectedImages);
        setImageUploads(imageUri);
        // handleSend();
      }
    });
  };
  const handleSend = () => {
    // 处理发送文本的逻辑
    const actionCreator = postMessage(createMessage(text, 'text'),
      [()=>{
      setText('');
    }]);
    console.log('actionCreator: ', actionCreator);
    dispatch(actionCreator);
  };
  const uploadImage = async(newImage) => {
    const actionCreator = postMessage( createMessage(newImage.uri, 'image')
      , []);
    // console.log('actionCreator: ', actionCreator);
    dispatch(actionCreator);
    // const {file, id} = newImage || {};
    // if (!file) return;
    // let response = {};
    // const uri = file.uri || '';
    // const contentType = 'multipart/form-data';
    // console.log('messageInputContext');
    return newImage;
    // sendImage(uri, filename, contentType).then(
    //   (res) => {
    //     const newImageUploads = getUploadSetStateAction(
    //       id,
    //       FileState.UPLOADED,
    //       {
    //         url: res.file,
    //       },
    //     );
    //     setImageUploads(newImageUploads);
    //   }
    // );
  };
  const removeImage = (uri) => {
    setImageUploads(imageUploads.filter((image) => image.uri !== uri));
  };

  // const handleChooseImage = async () => {
  //   try {
  //     const result = await launchImageLibraryAsync({
  //       mediaTypes: MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });
  //     if (!result.cancelled) {
  //       console.log('选择照片成功:', result.uri);
  //       // 在这里处理选择照片后的逻辑，例如上传照片
  //     } else {
  //       console.log('用户取消了选择照片');
  //     }
  //   } catch (error) {
  //     console.error('选择照片出错:', error);
  //   }
  // };
  const messageInputContext = {
    removeImage,
    uploadImage,
    uploadImages,
    imageUploads,
    setImageUploads,
    handleChooseImage,
    handleChooseFile,
    handleTakePhoto,
    text,
    setText,
    handleSend,
  };
  return (
    <MessageInputContext.Provider
      value={messageInputContext}
    >
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
