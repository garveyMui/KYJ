import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {MessageInterface, postMessage} from '@/store/modules/Messages';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useChatContext} from './ChatContext';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {useMessageManager} from '@/components/functional/MessageManager';
import {ChatObject} from '@/store/modules/ChatObject.ts';

// Context types
interface MessageInputContextProps {
  removeImage: (uri: string) => void;
  uploadImage: (newImage: ImageType) => Promise<ImageType>;
  uploadImages: () => void;
  imageUploads: ImageType[];
  setImagesToUpload: React.Dispatch<React.SetStateAction<ImageType[]>>;
  handleChooseImage: () => void;
  handleChooseFile: () => void;
  handleTakePhoto: () => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  imagePreviewVisible: boolean;
  filePreviewVisible: boolean;
  uploadFiles: () => void;
  filesToUpload: FileType[];
  filesUploaded: FileType[];
  removeFile: (uri: string) => void;
}

// Types for image and file
interface ImageType {
  uri: string;
}

interface FileType {
  uri: string;
  name: string;
}

// Create the context
export const MessageInputContext = createContext<MessageInputContextProps | undefined>(undefined);

// Context Provider component
interface MessageInputProviderProps {
  children: ReactNode;
}

export const MessageInputProvider: React.FC<MessageInputProviderProps> = ({ children }) => {
  const savePDFToDocuments = async () => {
    const pdfName = 'NIPS-2012-imagenet-classification-with-deep-convolutional-neural-networks-Paper.pdf';
    const pdfPath = `${RNFS.MainBundlePath}/${pdfName}`;
    const documentsPath = RNFS.DocumentDirectoryPath;
    const savePath = `${documentsPath}/${pdfName}`;
    const exists = await RNFS.exists(savePath);

    if (exists) return;

    try {
      const fileContent = await RNFS.readFile(pdfPath, 'base64');
      await RNFS.writeFile(savePath, fileContent, 'base64');
      Alert.alert('文件保存成功');
    } catch (error: any) {
      Alert.alert('保存文件失败', error.message);
    }
  };

  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [filePreviewVisible, setFilePreviewVisible] = useState(false);
  const [text, setText] = useState('');
  const [imagesToUpload, setImagesToUpload] = useState<ImageType[]>([]);
  const [imagesUploaded, setImagesUploaded] = useState<ImageType[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileType[]>([]);
  const [filesUploaded, setFilesUploaded] = useState<FileType[]>([]);
  const chatObject = useSelector((state: any) => state.chatObject) as ChatObject;
  const dispatch = useDispatch();
  const { handleScrollToEnd } = useChatContext();

  type ContentHandler = (content: string, name?: string) => {
    text?: string;
    mediaUrl?: string;
    mediaInfo?: {
      name: string;
      size: number;
      mimeType: string;
    };
  };

  const contentHandlers: Record<
    'text' | 'video' | 'image' | 'file' | 'location' | 'audio' | 'default',
    ContentHandler
  > = {
    text: (content: string) => ({ text: content }),
    default: (content: string, name: string = '') => ({
      mediaUrl: content,
      mediaInfo: {
        name,
        size: 0,
        mimeType: 'image/jpeg', // 默认 MIME 类型
      },
    }),
  };

  const createMessage = (
    content: string,
    contentType: 'video' | 'text' | 'image' | 'file' | 'location' | 'audio' | 'default',
    name = ''
  ): MessageInterface => {
    const handler = contentHandlers[contentType] || contentHandlers.default;

    return {
      messageId: uuidv4(),
      conversationId: chatObject.conversationId,
      sender: {
        id: '-1',
        name: 'user',
        avatar: require('../../assets/avatar.jpg'),
        status: {
          online: true,
          lastSeen: null,
        },
      },
      recipient: chatObject.user,
      content: {
        type: contentType,
        ...handler(content, name),
      },
      isRead: true,
      timestamp: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss') + 'Z',
    };
  };

  const { handleSendMessage } = useMessageManager();

  const handleSend = () => {
    handleSendMessage(createMessage(text, 'text'), [() => setText('')]);
    handleScrollToEnd();
  };
  const uploadImage = async (newImage: ImageType): Promise<ImageType> => {
    handleSendMessage(createMessage(newImage.uri, 'image'), []);
    return newImage;
  };
  const uploadFile = async (file: FileType): Promise<FileType> => {
    handleSendMessage(createMessage(file.uri, 'file', file.name), []);
    return file;
  };

  const uploadImages = () => {
    setImagesUploaded([]);
    const uploadPromises = imagesToUpload.map((image) => uploadImage(image));
    Promise.all(uploadPromises)
      .then((responses) => {
        setImagesUploaded(responses);
        handleScrollToEnd();
      })
      .catch(console.error);
  };

  const uploadFiles = () => {
    setFilesUploaded([]);
    const uploadPromises = filesToUpload.map((file) => uploadFile(file));
    Promise.all(uploadPromises)
      .then((responses) => {
        setFilesUploaded(responses);
        handleScrollToEnd();
      })
      .catch(console.error);
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
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && response.assets) {
        const selected = response.assets.map((asset) => ({ uri: asset.uri! }));
        setImagesToUpload(selected);
        setImagePreviewVisible(true);
      }
    });
  };

  const handleChooseFile = async () => {
    try {
      setFilesUploaded([]);
      const result = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles] });
      setFilesToUpload(result.map((file) => ({ uri: file.uri!, name: file.name! })));
      setFilePreviewVisible(true);
    } catch (err: any) {
      if (!DocumentPicker.isCancel(err)) throw err;
    }
  };



  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchCamera(options, (response) => {
      if (!response.didCancel && response.assets) {
        console.log(response.assets[0].uri);
      }
    });
  };

  const removeImage = (uri: string) => {
    setImagesToUpload((prev) => prev.filter((image) => image.uri !== uri));
  };

  const removeFile = (uri: string) => {
    setFilesToUpload((prev) => prev.filter((file) => file.uri !== uri));
  };

  useEffect(() => {
    savePDFToDocuments();
  }, []);

  useEffect(() => {
    if (imagesUploaded.length === imagesToUpload.length) {
      setImagesToUpload([]);
      setImagePreviewVisible(false);
    }
  }, [imagesUploaded, imagesToUpload.length]);

  useEffect(() => {
    if (filesUploaded.length === filesToUpload.length) {
      setFilesToUpload([]);
      setFilePreviewVisible(false);
    }
  }, [filesUploaded, filesToUpload.length]);

  const messageInputContext: MessageInputContextProps = {
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
const useMessageInputContext = (): MessageInputContextProps => {
  const contextValue = useContext(MessageInputContext);
  if (!contextValue) {
    throw new Error('useMessageInputContext must be used within a MessageInputProvider');
  }
  return contextValue;
};

export { useMessageInputContext };
