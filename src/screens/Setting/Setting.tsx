// this setting page is steal from @tencentcloud/chat-uikit-react-native'

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import type { IRouterParams } from '@/interface.ts';

import { clearUserInfo } from '@/store/modules/User.ts';
import { useDispatch } from 'react-redux';
import avatarImage from '@/assets/avatar.jpg';

interface IConfig {
  name: string;
  value?: string;
  key?: string;
  route?: string;
}

export const Setting = ({ navigation }: IRouterParams) => {
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [configList, setConfigList] = useState<IConfig[]>([]);
  const [isPageShow, setIsPageShow] = useState<boolean>(true);

  const dispatch = useDispatch();
  const onComfirm = () => {
    dispatch(clearUserInfo());
  };
  const onPress = () => {
    Alert.alert(
      '确认退出',
      '您确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: () => {
            onComfirm();
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onPressSetting = (item: IConfig) => {
    item.route && navigation.navigate(item.route);
  };

  return isPageShow && (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <Text style={styles.title}>SETTING</Text>
      <View style={styles.profileContainer}>
        <Image source={avatarImage} style={styles.avatarContainer} alt={'Avatar'} />
        <View style={styles.profile}>
          <Text style={styles.nick} ellipsizeMode="tail" numberOfLines={1}>
            {profile.nick || '-'}
          </Text>
          <Text style={styles.text} numberOfLines={2}>
            {`ID: ${profile.userID}`}
          </Text>
          <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
            {profile.selfSignature || 'NO_SIGNATURE'}
          </Text>
        </View>
      </View>
      <View style={styles.settingContainer}>
        {configList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            activeOpacity={1}
            onPress={() => { onPressSetting(item); }}
          >
            <Text style={styles.label} ellipsizeMode="tail" numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.content}>
              <Text style={styles.value} ellipsizeMode="tail" numberOfLines={1}>
                {item.value}
              </Text>
              <AntDesign name="message1" size={10} color={'black'} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 0,
    overflow: 'hidden',
    zIndex: 101,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#FFFFFF',
  },
  title: {
    paddingTop: 2,
    paddingBottom: 15,
    paddingHorizontal: 16,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '600',
    color: '#000000',
  },
  profileContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  profile: {
    flex: 1,
    gap: 2,
  },
  nick: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '500',
    color: '#000000',
  },
  text: {
    color: '#000000CC',
    fontSize: 12,
    lineHeight: 16,
  },
  settingContainer: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 23,
  },
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0000001A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    color: '#00000099',
    fontSize: 16,
    lineHeight: 22,
  },
  content: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  value: {
    flexShrink: 1,
    color: '#000000',
    fontSize: 16,
    lineHeight: 22,
  },
  icon: {
    width: 15,
    height: 22,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F9F9F9F0',
  },
  buttonText: {
    color: '#FF584C',
    fontSize: 16,
    lineHeight: 22,
  },
});
