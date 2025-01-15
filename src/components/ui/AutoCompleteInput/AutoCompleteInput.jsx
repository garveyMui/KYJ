import React from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import {useDocsInputContext} from '@/components/context';
import {MessageInput} from '@/components/ui/MessageInput';

const AutoCompleteInput = () => {
  const {
    inputText,
    handleInputChange,
    suggestions,
    handleSuggestionSelect: onSuggestionSelect,
  } = useDocsInputContext();
  return (
    <View style={styles.container}>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Text
              style={styles.suggestion}
              onPress={() => onSuggestionSelect(item)}>
              {item}
            </Text>
          )}
        />
      )}
      <MessageInput onChangeText={handleInputChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 'auto',
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
});

export {AutoCompleteInput};
