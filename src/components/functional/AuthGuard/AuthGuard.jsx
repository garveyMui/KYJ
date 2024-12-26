import { getToken } from '@/utils/tokens';
import React from 'react';
import {View, ActivityIndicator} from 'react-native';

export const AuthGuard = ({children, navigation}) => {
  const token = getToken();
  if (token) {
    // return <>{children}</>;
    navigation.navigate('Home');
  }else{
    return <>{children}</>;
    // return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <ActivityIndicator size="large" color="#0000ff" />
    //   </View>
    // );
  }
};
