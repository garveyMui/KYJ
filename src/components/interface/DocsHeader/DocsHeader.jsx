import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useRef, useState } from 'react';

export const DocsHeader = ({ navigateBack, navigateToChatSetting, chatObject }) => {
  const [visible, setVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownButtonRef = useRef(null);

  const toggleModal = () => {
    if (!visible) {
      dropdownButtonRef.current.measure(
        (fx, fy, width, height, px, py) => {
          setDropdownPosition({
            top: py + height, // Position below the button
            left: px,         // Align horizontally with the button
          });
          setVisible(true);
        }
      );
    } else {
      setVisible(false);
    }
  };

  const handleOptionSelect = (option) => {
    console.log('Selected Option:', option);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#000" />
      </TouchableOpacity>
      <Image source={{ uri: chatObject.avatar }} style={styles.avatar} />
      <Text style={styles.username}>{chatObject.name}</Text>
      <TouchableOpacity
        ref={dropdownButtonRef}
        onPress={toggleModal}
        style={styles.dropdownButton}
      >
        <AntDesign name="down" size={24} color="#000" />
      </TouchableOpacity>
      {visible && (
        <View
          style={[
            styles.dropdownContainer,
            { top: dropdownPosition.top, left: dropdownPosition.left },
          ]}
        >
          <TouchableOpacity onPress={() => handleOptionSelect('chatgpt')}>
            <Text style={styles.dropdownOption}>ChatGPT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('deepseek')}>
            <Text style={styles.dropdownOption}>DeepSeek</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('chatglm')}>
            <Text style={styles.dropdownOption}>ChatGLM</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.dropdownOption}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={navigateToChatSetting}
        style={styles.settingButton}
      >
        <AntDesign name="setting" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 'auto',
  },
  dropdownButton: {
    marginLeft: 10,
  },
  settingButton: {
    marginLeft: 'auto',
  },
  settingIcon: {
    width: 24,
    height: 24,
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
  },
  dropdownOption: {
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
});
