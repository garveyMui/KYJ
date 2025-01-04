import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {TabBar} from '@/components/interface/TabBar';
import HomeHeader from '@/components/interface/HomeHeader/HomeHeader';

// Define the HomeScreen component
function Home({ navigation }) {

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader title="Home" />
      <TabBar />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
export { Home };
