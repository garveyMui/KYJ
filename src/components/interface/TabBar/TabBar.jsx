import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {UserProfile} from '../UserProfile';
import {StyleSheet, View} from 'react-native';
import {ChatListScreen} from '@/pages/UIKitScreen';
import {DocScreen} from '@/pages/UIKitScreen/DocScreen';
import {ContactsScreen} from '@/pages/UIKitScreen/ContactsScreen';

const Tab = createBottomTabNavigator({

});
function TabBar() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Docs"
        screenOptions={{
          activeTintColor: '#e91e63',
          size: 10,
          headerStyle: {
            height: 40, // Adjust header height
            backgroundColor: '#f8f8f8', // Example background color
            paddingTop: 0, // Adjust top padding
            marginTop: 0,
            justifyContent: 'flex-start',
            alignItems: 'center',
          },
          headerTitleStyle: {
            fontSize: 20, // Adjust font size
            fontWeight: 'bold', // Optional: change font weight
            marginTop: -15,
            paddingTop: 0,
            textAlign: 'center',
            lineHeight: 20,
          },
        }}
      >
        <Tab.Screen
          name="Messenger"
          component={ChatListScreen}
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
          component={DocScreen}
          options={{
            headerShown: false,
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
          component={ContactsScreen}
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
