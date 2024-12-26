import React, { useEffect, useState } from 'react';
import { getToken } from '@/utils/tokens';
import { View, ActivityIndicator } from 'react-native';

const AuthGuard = ({ children, navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken(); // 假设 getToken 是异步的
      if (token) {
        setIsAuthenticated(true);
      } else {
        navigation.navigate('Login');
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
