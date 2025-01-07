import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {fetchLogin, setToken} from '@/store/modules/User';
import {logginAPI, registerAPI} from '@/apis/auth';

export const Login = ({navigation}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await registerAPI({
        username,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      dispatch(fetchLogin({ username, password }));
      const response = await logginAPI(
        {
          username,
          password,
        },
      );
      if (response.status === 200) {
        // 成功登录后，将 JWT token 存储在 AsyncStorage 中
        await AsyncStorage.setItem('jwtToken', response.data.token);
        console.log(response.data);
        navigation.navigate('Home');
      } else if (response.status === 400) {
        Alert.alert('登录失败', '用户名或密码错误');
      } else if (response.status === 401) {
        Alert.alert('登录失败', '未知错误');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegisterMode ? '注册' : '登录'}</Text>
      <TextInput
        style={styles.input}
        placeholder="用户名: admin"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="密码: password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      {isRegisterMode ? (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>注册</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>登录</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
        <Text style={styles.link}>
          {isRegisterMode ? '已有账号？去登录' : '没有账号？去注册'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#007BFF',
    fontSize: 14,
  },
});

