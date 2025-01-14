import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import HomeHeader from '@/components/ui/HomeHeader/HomeHeader';
import {HomeTabNavigator} from '@/navigations/HomeTabNavigator';

// Define the HomeScreen component
function Home({ navigation }) {

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader title="Home" />
      <HomeTabNavigator />
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
