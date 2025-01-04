import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import React, { useState, useEffect } from 'react';

export const ContactList = () => {
  const {contacts} = useSelector((state) => state.contacts);
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  item: {
    height: 60,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
