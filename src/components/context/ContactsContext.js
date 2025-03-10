import React, {createContext, useContext} from 'react';

const ContactsContext = createContext();
export const ContactsContextProvider = ({children}) => {

  const contactsContext = {

  };
  return (
    <ContactsContext.Provider value={contactsContext}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContactsContext = () => {
  const context = useContext(ContactsContext);
  return context;
};