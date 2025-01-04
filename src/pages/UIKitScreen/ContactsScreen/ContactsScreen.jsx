import {View} from 'react-native';
import {Contacts} from '@/components/interface/Contacts';
import {ContactsContextProvider} from '@/components/context';
import React from'react';

export const ContactsScreen = () => {
  return (
    <View>
      <ContactsContextProvider>
        <Contacts />
      </ContactsContextProvider>
    </View>
  );
};
