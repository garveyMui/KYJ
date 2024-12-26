import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Text>this is profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {UserProfile};

