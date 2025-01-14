import { createSlice } from '@reduxjs/toolkit';
import {User} from '@/store/modules/User';

interface PhoneNumber {
  type: "mobile" | "work" | "home" | string; // 允许预定义类型或自定义类型
  number: string; // 电话号码，支持国际号码格式
}

interface EmailAddress {
  type: "personal" | "work" | "other" | string; // 允许预定义类型或自定义类型
  email: string; // 邮箱地址
}

interface CustomFields {
  [key: string]: string | number | boolean | null; // 动态键值对
}

interface ContactSettings {
  mute: boolean; // 是否静音此联系人的通知
  favorite: boolean; // 是否标记为收藏
}

export interface Contact {
  contactId: string; // 唯一标识符
  user: User;
  nickname?: string; // 联系人昵称，可选
  phoneNumbers?: PhoneNumber[]; // 电话号码列表
  emailAddresses?: EmailAddress[]; // 邮件地址列表
  tags?: string[]; // 标签列表
  customFields?: CustomFields; // 用户自定义字段，可选
  addedAt?: string; // 添加联系人时间，ISO 8601 格式
  mutualFriendsCount?: number; // 共同好友数量，可选
  settings: ContactSettings; // 联系人设置
}

interface PrivacySettings {
  shareLastSeen: boolean;                   // 是否分享最后在线时间
  shareStatusMessage: boolean;              // 是否分享状态消息
}
interface Contacts {
  contacts: Contact[];
}

const mockContacts: Contact[] = require('./mockContacts.json');

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: mockContacts,
  },
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    addContact(state, action) {
      state.contacts.push(action.payload);
    },
    removeContact(state, action) {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
    },
    removeContacts(state, action) {

    },
  },
});

const getContacts = () => {
  return async (dispatch) => {
    dispatch(setContacts(action.payload));
  };
};

const getContact = (id) => {
  return async (dispatch) => {
    dispatch(setContacts(action.payload));
  };
};

const postAddContact = (uid, webSocket) => {
  return async (dispatch) => {
    dispatch(addContact(action.payload));
  };
};

const putModifyContact = (contact, webSocket) => {
  return async (dispatch) => {
    dispatch(removeContact(action.payload));
  };
};

const deleteContact = (id) => {
  return async (dispatch) => {
    dispatch(removeContact(action.payload));
  };
};

export const {
  setContacts,
  addContact,
  removeContact,
  removeContacts,
} = contactsSlice.actions;

export { getContacts, getContact, postAddContact, putModifyContact, deleteContact };

export default contactsSlice.reducer;