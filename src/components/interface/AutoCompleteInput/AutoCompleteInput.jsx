import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import {useDocsInputContext} from '@/components/context';

const AutoCompleteInput = () => {
  const {inputText, handleInputChange, suggestions, handleSuggestionSelect : onSuggestionSelect} = useDocsInputContext();
  return (
    <View style={styles.container}>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.suggestion} onPress={() => onSuggestionSelect(item)}>
              {item}
            </Text>
          )}
        />
      )}
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={handleInputChange}
        placeholder="输入文本"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
});

export {AutoCompleteInput};
