import React, {useEffect, useState} from 'react';

import {IRouterParams} from '../../../interface';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {DocsList} from '../DocsList';
import {AutoCompleteInput} from '../AutoCompleteInput';
import {
  DocsInputProvider,
  MessageInputProvider,
  useChatContext,
} from '@/components/context';
import {useDocsContext} from '@/components/context/DocsContext';
import {MessageList} from '@/components/ui/MessageList';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setMessage} from '@/store/modules/Messages';

const windowHeight = Dimensions.get('window').height;
export const Docs = ({navigation}: IRouterParams) => {
  const navigateToChatSetting = () => {
    navigation.navigate('ChatSetting');
  };
  const dispatch = useDispatch();
  const {messagesList} = useSelector((state: RootState) => state.messages);
  console.log('Docs chat', messagesList);
  const {contentOffset} = useChatContext();
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle between 75% height and full screen
  const [layout, setLayout] = useState({
    docsListFlexBasis: '20%',
    AIChatFlexBasis: '60%',
  });
  useEffect(() => {
    const shrinkLayout = {docsListFlexBasis: '20%', AIChatFlexBasis: '60%'};
    const expandLayout = {docsListFlexBasis: '0%', AIChatFlexBasis: '90%'};
    if (isExpanded) {
      setLayout(expandLayout);
    } else {
      setLayout(shrinkLayout);
    }
  }, [isExpanded]);
  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };
  const handleClose = () => {
    // setLayout({
    //   docsListFlexBasis: '80%',
    //   AIChatFlexBasis: '0%',
    // });
    dispatch(setMessage([]));
  };
  return (
    <View style={[styles.container, {bottom: contentOffset}]}>
      <View
        style={[
          styles.docsListContainer,
          {flexBasis: layout.docsListFlexBasis},
        ]}>
        <DocsList />
      </View>
      {messagesList.length > 0 && (
        <View
          style={[styles.AIChatContainer, {flexBasis: layout.AIChatFlexBasis}]}
        >
          <View style={styles.AIBtnContainer}>
            <TouchableOpacity onPress={toggleHeight} style={styles.toggleButton}>
              <AntDesign
                name={isExpanded ? 'shrink' : 'arrowsalt'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} style={styles.toggleButton}>
              <AntDesign
                name={'close'}
                size={28}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <MessageList messagesList={messagesList} style={{height: 'auto'}} />
        </View>
      )}
      <View style={[styles.inputContainer]}>
        <MessageInputProvider>
          <DocsInputProvider>
            <AutoCompleteInput />
          </DocsInputProvider>
        </MessageInputProvider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    height: windowHeight,
    borderStyle: 'solid',
    borderWidth: 1,
    // backgroundColor: 'yellow',
  },
  docsListContainer: {
    flex: 1,
    flexBasis: '20%',
    width: '100%',
    // backgroundColor: 'green',
  },
  AIChatContainer: {
    flex: 1,
    flexBasis: '60%',
    height: 200,
    flexDirection: 'column',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 10,
    // backgroundColor: 'blue',
  },
  AIBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toggleButton: {
    marginRight: 10,
  },
  inputContainer: {
    flexGrow: 0,
    flexShrink: 0,
    // flexBasis: '10%',
    borderWidth: 1,
    width: '100%',
    // height: 'auto',
    // height: 200,
  },
});
