import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useState} from 'react';
import dropdownOptions from '@/assets/data/supportedLLM.json';
import i1 from '@/assets/icons/deepseek.png';
import avatarImage from '@/assets/avatar.jpg';
import {setChatObject} from '@/store/modules/ChatObject';
import {useDispatch} from 'react-redux';
export const llmAvatars = [
  i1,
  require('@/assets/icons/chatgpt.png'),
  require('@/assets/icons/chatglm.png'),
];
llmAvatars.forEach((image, index) => {
   console.log(image);
});
export const DocsHeader = ({
  navigateBack,
  navigateToChatSetting,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [llmObject, setLlmObject] = useState(dropdownOptions[0]);
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  const handleOptionSelect = option => {
    console.log('Selected Option:', option);
    if (option !== dropdownOptions.length - 1) {
      setLlmObject(dropdownOptions[option]);
    }
    setDropdownVisible(false); // Close dropdown after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{llmObject.name}</Text>
      <TouchableOpacity
        style={[styles.avatarContainer]}
        >
        <Image source={llmAvatars[llmObject.id]} style={styles.avatar} alt={'Avatar'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <AntDesign name="down" size={24} color="#000" />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          {dropdownOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionSelect(option.id)}>
              <Text style={styles.dropdownOption}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={navigateToChatSetting}
        style={styles.settingButton}>
        <AntDesign name="setting" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
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
  dropdownContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 40, // Position dropdown below the button
    left: '50%',
    transform: [{ translateX: '-50%' }], // Center dropdown
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
    width: 200, // Width of the dropdown menu
  },
  dropdownOption: {
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 0, // 初始化为0, 后续通过计算设置
    overflow: 'hidden',
    zIndex: 101,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
