import React from 'react';
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import {TabBar} from '../../components/interface/TabBar';
import {Icon} from '@ant-design/react-native';
import {UserProfile} from '../../components/interface/UserProfile';

// Define the HomeScreen component
function Home({ navigation }) {

  return (
    <SafeAreaView style={styles.container}>
      {/*<TabBar />*/}
      <Text>This is Home</Text>
      <TabBar />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export { Home };
