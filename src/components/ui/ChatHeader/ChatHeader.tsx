import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ChatObject} from '@/store/modules/ChatObject.ts';

const ChatHeader:React.FC<Props> = ({navigateBack, navigateToChatSetting, chatObject}) => {
  console.log('chatObject in header', chatObject);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#000" />
      </TouchableOpacity>
      <Image source={{uri: chatObject.avatar}} style={styles.avatar} />
      <Text style={styles.username}>{chatObject.displayName}</Text>
      <TouchableOpacity
        onPress={navigateToChatSetting}
        style={styles.settingButton}>
        <AntDesign name="setting" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

interface Props {
  navigateBack: ()=>void;
  navigateToChatSetting: () => void;
  chatObject: ChatObject;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 40,
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
  settingButton: {
    marginLeft: 'auto',
  },
  settingIcon: {
    width: 24,
    height: 24,
  },
});

export {ChatHeader};
