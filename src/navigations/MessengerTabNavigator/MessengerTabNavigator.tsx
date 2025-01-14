import React, {useState} from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IRouterParams} from '@/interface.ts';
import {SceneMap, TabView} from 'react-native-tab-view';
import {ChatListScene} from '@/screens/UIKitScreen';
import {UnreadListScene} from '@/screens/UIKitScreen/UnreadListScene';
import {ChatObject} from '@/store/modules/ChatObject.ts';
import {MessageInterface} from '@/store/modules/Messages.ts';
import {MessengerContextProvider} from '@/components/context/MessengerContext.tsx';

const ChatRoute = () => {
  return ChatListScene();
};

interface OnPressConvProps {
  onPressConversation: (chatObject: ChatObject, conversationId: string, messages: MessageInterface[]) => void;
}

const UnreadRoute: React.FC<OnPressConvProps> = ({onPressConversation}) => {
  return UnreadListScene({onPressConversation});
};

const NoticeRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#009688' }]}>
    <Text>Third Tab Content</Text>
  </View>
);

const FlagRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#009688' }]}>
    <Text>Fourth Tab Content</Text>
  </View>
);

export const MessengerTabNavigator = ({ navigation }: IRouterParams) => {

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'unread', title: 'Unread' },
    { key: 'notice', title: 'Notice' },
    { key: 'flag', title: 'Flag' },
  ]);
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const renderScene = SceneMap({
    'chat': ChatRoute,
    'unread': UnreadRoute,
    'notice': NoticeRoute,
    'flag': FlagRoute,
  });
  // Create an animated value for smooth tab indicator transition
  const tabIndicatorPosition = useState(new Animated.Value(0))[0];
  // Animated background color
  const backgroundColor = tabIndicatorPosition.interpolate({
    inputRange: [0, 1, 2], // Corresponding to the tabs
    outputRange: ['#009688', '#ff4081', '#673ab7'], // Color change for each tab
  });
  // Update tab indicator position when the index changes
  const onIndexChange = (newIndex: number) => {
    Animated.spring(tabIndicatorPosition, {
      toValue: newIndex * (tabBarWidth / routes.length),
      useNativeDriver: false,
      tension: 150,           // 较高的张力，使得滑块快速起动
      friction: 30,           // 中等摩擦力，使滑块稍微减速但不是很慢
      overshootClamping: true, // 限制滑块的过冲，不会超过目标位置
      restDisplacementThreshold: 0.1, // 减少目标位置的最小位移
      restSpeedThreshold: 0.1,         // 设置最小速度来停止动画
    }).start();
    setIndex(newIndex);
  };
  const renderTabBar = (props: any) => {
    return (
      <View
        style={styles.tabBarContainer}
        onLayout={(e) => {
          const {width} = e.nativeEvent.layout;
          console.log('width', width);
          setTabBarWidth(width);
        }}
      >
        {props.navigationState.routes.map((route, i) => (
          <Animated.View
            key={i}
            style={[
              styles.tabItem,
              i === props.navigationState.index && styles.activeTabItem,
            ]}
            onTouchStart={() => onIndexChange(i)}
          >
            <Text
              style={[
                styles.tabText,
                i === props.navigationState.index && styles.activeTabText,
              ]}
            >
              {route.title}
            </Text>
          </Animated.View>
        ))}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              left: tabIndicatorPosition, // Animated left position
              width: tabBarWidth / routes.length, // Dynamic width based on tab count
            },
          ]}
        />
      </View>
    );
  };

  return (
    <MessengerContextProvider>
      <View style={styles.container}>
        <TabView
          style={styles.tabView}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </MessengerContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabView: {
    flex: 1,
    zIndex: 100,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 1,
  },
  activeTabItem: {
    borderRadius: 25,
    zIndex: 100,
    // transition: 'left 0.3s ease-in-out', // Smooth transition
  },
  tabText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    zIndex: 90,
    bottom: 0,
    height: 30,
    backgroundColor: '#ff4081', // Custom color for the active tab indicator
    borderRadius: 25,
    // transition: 'left 0.3s ease-in-out', // Smooth transition
  },
});
