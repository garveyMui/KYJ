import React from 'react';
import {Image, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {DocsHeader} from '@/components/ui/DocsHeader';
import avatarImage from '@/assets/avatar.jpg';
import {ContactsHeader} from '@/components/ui/ContactsHeader';

const HomeHeader = ({title}) => {
  const navigation = useNavigation();
  const handleSettingPress = () => {
    navigation.navigate('Setting');
  };
  const navigateBack = () => {
    navigation.goBack();
  };
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };

  const {id: sender, name, avatar} = useSelector(state => state.chatObject);
  const chatObject = {
    id: 0,
    name: 'ChatGPT',
    avatar,
  };
  const {routeName: currentRoute} = useSelector(state => state.bottomTab);

  // 获取屏幕宽度并计算右边距
  const screenWidth = Dimensions.get('window').width;

  const renderHeaderContentByRoute = () => {
    const routeConfig = {
      Docs: (
        <DocsHeader
          navigateBack={navigateBack}
          navigateToChatSetting={navigateToChatSetting}
          chatObject={chatObject}
        />
      ),
      Contacts: (
        <ContactsHeader />
      ),
      default: (
        <Text style={styles.routeText}>{currentRoute || 'No Route Name'}</Text>
      ),
    };
    return routeConfig[currentRoute] || routeConfig.default;
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.avatarContainer]}
        onPress={handleSettingPress}>
        <Image source={avatarImage} style={styles.avatar} alt={'Avatar'} />
      </TouchableOpacity>
      {renderHeaderContentByRoute()}
    </View>
  );
};

const styles = {
  header: {
    height: 35,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    position: 'relative',
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
  routeText: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    color: 'black',
    fontSize: 18,
  },
};

export default HomeHeader;
