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

const ChatRoute = () => {
  return ChatListScene();
};

const UnreadRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
    <Text>Second Tab Content</Text>
  </View>
);

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
  const onIndexChange = (newIndex) => {
    setIndex(newIndex);
    Animated.spring(tabIndicatorPosition, {
      toValue: newIndex * (Dimensions.get('window').width / routes.length),
      useNativeDriver: false, // We are animating the left property
    }).start();
  };

  const renderTabBar = (props) => {
    return (
      <View style={styles.tabBarContainer}>
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
              width: Dimensions.get('window').width / routes.length, // Dynamic width based on tab count
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TabView
        style={styles.tabView}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
    </View>
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
    backgroundColor: '#009688',
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
