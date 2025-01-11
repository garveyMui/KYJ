// src/navigation/tabConfig.ts
import {ChatListScene} from '@/screens/UIKitScreen';
import {DocScreen} from '@/screens/UIKitScreen/DocScreen';
import {ContactsScreen} from '@/screens/UIKitScreen/ContactsScreen';
import {MessengerTabNavigator} from '@/navigations/MessengerTabNavigator';

export const tabConfig = [
  {
    name: "Messenger",
    component: MessengerTabNavigator,
    icon: "message1",
    label: "Messenger",
  },
  {
    name: "Docs",
    component: DocScreen,
    icon: "inbox",
    label: "Docs",
  },
  {
    name: "Contacts",
    component: ContactsScreen,
    icon: "team",
    label: "Contacts",
  },
];
