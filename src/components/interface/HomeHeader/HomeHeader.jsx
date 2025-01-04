
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = ({ title }) => {
  const navigation = useNavigation();

  const handleSettingPress = () => {
    navigation.navigate('Setting');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.settingButton} onPress={handleSettingPress}>
        {/*<Ionicons name="ios-settings" size={24} color="white" />*/}
        <AntDesign name="setting" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = {
  header: {
    height: 35,
    width: '100%',
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  settingButton: {
    marginLeft: 0,
    padding: 5,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default HomeHeader;
