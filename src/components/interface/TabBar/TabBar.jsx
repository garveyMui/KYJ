import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
const Tab = createBottomTabNavigator();
import { UserProfile } from '../UserProfile';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {ConversationListScreen} from '../../../pages/UIKitScreen';

function TabBar() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Docs"
        screenOptions={{
          activeTintColor: '#e91e63',
          size: 10,
        }}
      >
        <Tab.Screen
          name="Messenger"
          component={ConversationListScreen}
          options={{
            tabBarLabel: 'Messenger',
            tabBarIcon: ({ color , size }) => (
              // <MaterialCommunityIcons name="home" color={color} size={size} />
              <AntDesign name="message1" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Docs"
          component={UserProfile}
          options={{
            tabBarLabel: 'Docs',
            tabBarIcon: ({ color, size }) => (
              // <MaterialCommunityIcons name="account-box-multiple-outline" color={color} size={size} />
              <AntDesign name="inbox" size={size} color={color} />
            ),
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={UserProfile}
          options={{
            tabBarLabel: 'Contacts',
            tabBarIcon: ({ color, size }) => (
              // <MaterialCommunityIcons name="account" color={color} size={size} />
              <AntDesign name="team" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // 使用flex布局,
    flexDirection: 'row',
    justifyContent: 'flex-start', // 子元素从顶部开始排列
    alignItems: 'center', // 子元素在水平方向上居中对齐
  },
})
export { TabBar };
