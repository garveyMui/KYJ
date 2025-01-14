import {tabConfig} from './tabConfig';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setBottomTab} from '@/store/modules/BottomTab';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useMemo} from 'react';
import {ConversationInterface} from '@/store/modules/Conversations.ts';
import {RootState} from '@/store';

const Tab = createBottomTabNavigator();
const HomeTabNavigator = () => {
  const dispatch = useDispatch();
  const {conversations} = useSelector((state: RootState) => state.conversation);
  const {activeConversationId} = useSelector((state: RootState) => state.conversation);
  const clickedConversationEvent = activeConversationId && (conversations[activeConversationId])?.unreadCountTotal;
  const badgeCounts = useMemo(() => {
    const result: number[] = [];
    let unreadMessageCount = 0;
    Object.values<ConversationInterface>(conversations).forEach((conversation: ConversationInterface) => {
      unreadMessageCount += conversation.unreadCountTotal;
    });
    result.push(unreadMessageCount);
    return result;
  }, [conversations, clickedConversationEvent]);
  console.log('badgeCounts', badgeCounts);
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
        {tabConfig.map((tab, index) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              headerShown: false,
              tabBarLabel: tab.label,
              tabBarIcon: ({ color, size }) => (
                <AntDesign name={tab.icon} size={size} color={color} />
              ),
              tabBarBadge: badgeCounts[index] > 0 ? badgeCounts[index] : null,
            }}
            listeners={() => ({
              tabPress: () => dispatch(setBottomTab(tab.name)),
            })}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1, // 使用flex布局,
    flexDirection: 'row',
    justifyContent: 'flex-start', // 子元素从顶部开始排列
    alignItems: 'center', // 子元素在水平方向上居中对齐
  },
});

export {HomeTabNavigator};
