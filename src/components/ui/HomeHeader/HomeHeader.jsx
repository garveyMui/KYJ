
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {DocsHeader} from '@/components/ui/DocsHeader';
import {RootState} from '@/store';
import avatarImage from '@/assets/avatar.jpg'

const HomeHeader = ({ title }) => {
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

  const {id: sender, name, avatar} = useSelector((state) => state.chatObject);
  const chatObject = {
    id: 0,
    name: 'ChatGPT',
    avatar,
  };
  console.log('avatar', avatarImage)
  const {routeName: currentRoute} = useSelector(state => state.bottomTab);
  console.log('currentRoute', currentRoute);
  const renderHeaderContentByRoute = () => {
    const routeConfig = {
      Docs: (
        <DocsHeader
          navigateBack={navigateBack}
          navigateToChatSetting={navigateToChatSetting}
          chatObject={chatObject}
        />
      ),
      // 未来可以继续添加其他路由的配置
      default: (
        <Text style={styles.routeText}>{currentRoute || 'No Route Name'}</Text>
      ),
    };
    return routeConfig[currentRoute] || routeConfig.default;
  };
  return (
    <View style={styles.header}>
      {/* 固定部分：头像 */}
      <TouchableOpacity style={styles.avatarContainer} onPress={handleSettingPress}>
        <Image source={avatarImage} style={styles.avatar} alt={'Avatar'} />
      </TouchableOpacity>
      {/* 路由特定内容部分 */}
      {renderHeaderContentByRoute()}
    </View>
  );
};

const styles = {
  header: {
    height: 35,
    width: '100%',
    // backgroundColor: '#3498db',
    flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginRight: 10,
    overflow: 'hidden',
    zIndex: 101,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  routeText: {
    position: 'absolute', // 绝对定位，确保它相对于父容器定位
    left: '50%', // 将元素从左边开始
    transform: [{ translateX: '-50%' }], // 使用 translateX 使它居中
    color: 'black',
    fontSize: 18,
  },
};

export default HomeHeader;
