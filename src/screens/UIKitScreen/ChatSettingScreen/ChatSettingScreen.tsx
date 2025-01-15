import React from 'react';

import {IRouterParams} from '@/interface.ts';
import {StyleSheet, View} from 'react-native';

export const ChatSettingScreen = ({navigation}: IRouterParams) => {
  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToConversationList = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
