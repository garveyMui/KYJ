import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useState} from 'react';

export const DocsHeader = ({
  navigateBack,
  navigateToChatSetting,
  chatObject,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleOptionSelect = option => {
    console.log('Selected Option:', option);
    setDropdownVisible(false); // Close dropdown after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{chatObject.name}</Text>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <AntDesign name="down" size={24} color="#000" />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => handleOptionSelect('chatgpt')}>
            <Text style={styles.dropdownOption}>ChatGPT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('deepseek')}>
            <Text style={styles.dropdownOption}>DeepSeek</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('chatglm')}>
            <Text style={styles.dropdownOption}>ChatGLM</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDropdownVisible(false)}>
            <Text style={styles.dropdownOption}>Cancel</Text>
          </TouchableOpacity>
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
    left: 0,
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
});
