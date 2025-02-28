import React, {useEffect, useState} from 'react';

import {IRouterParams} from '@/interface';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
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
  // console.log('Docs chat', messagesList);
  const {contentOffset} = useChatContext();
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle between 75% height and full screen
  const [layout, setLayout] = useState({
    docsListFlexBasis: '20%',
    AIChatFlexBasis: '60%',
  });
  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };
  const handleClose = () => {
    setIsExpanded(false);
    dispatch(setMessage([]));
  };
  return (
    <View style={[styles.container, {bottom: contentOffset}]}>
      {!isExpanded && <View
        style={[
          styles.docsListContainer
        ]}>
        <DocsList />
      </View>}
      {messagesList.length > 0 && (
        <View
          style={[styles.AIChatContainer, styles.card, styles.shadowProp, {flexBasis: layout.AIChatFlexBasis}]}
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
    // borderWidth: 1,
    // backgroundColor: 'white',
    // 轮廓阴影（适用于iOS）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },  // 阴影的方向
    shadowOpacity: 0.1, // 阴影的透明度
    shadowRadius: 8, // 阴影的模糊半径
    // 浮动阴影（适用于Android）
    elevation: 5,  // 安卓设备的阴影效果
  },
  docsListContainer: {
    flex: 1,
    flexBasis: '20%',
    visibility: 'hidden',
    width: '100%',
    height: 0,
    // backgroundColor: 'green',
  },
  card: {
    width: '98%',
    // backgroundColor: 'white',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 1,
    marginHorizontal: 'auto',
  },
  shadowProp: {
    // 轮廓阴影（适用于iOS）
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // 安卓设备的阴影效果
    elevation: 5,
  },
  AIChatContainer: {
    flex: 1,
    flexBasis: '60%',
    // height: 200,
    flexDirection: 'column',
    // width: 300,
    borderBottomWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    // borderWidth: 2,
    // padding: 10,
    // backgroundColor: '#C0C0C0', // 确保背景色是白色，这样才能显示阴影
    zIndex: 200,
    overflow: 'visible',
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
    borderWidth: 0,
    width: '100%',
    // height: 'auto',
    // height: 200,
  },
});
