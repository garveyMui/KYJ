import { createSlice } from '@reduxjs/toolkit';
// sample contact
// {
//   "contactId": "unique-contact-id",
//   "userId": "unique-user-id",
//   "name": "John Doe",
//   "nickname": "Johnny",
//   "avatarUrl": "https://example.com/avatar/john.jpg",
//   "phoneNumbers": [
//   { "type": "mobile", "number": "+1234567890" },
//   { "type": "work", "number": "+0987654321" }
// ],
//   "emailAddresses": [
//   { "type": "personal", "email": "john.doe@example.com" },
//   { "type": "work", "email": "j.doe@company.com" }
// ],
//   "tags": ["family", "coworker"],
//   "status": {
//   "online": true,
//     "lastSeen": "2025-01-01T10:00:00Z",
//     "statusMessage": "Busy working"
// },
//   "customFields": {
//   "birthday": "1990-05-15",
//     "notes": "Loves hiking and photography"
// },
//   "addedAt": "2023-12-31T12:00:00Z",
//   "mutualFriendsCount": 10,
//   "settings": {
//   "muteNotifications": false,
//     "favorite": true
// }
// }
interface PhoneNumber {
  type: "mobile" | "work" | "home" | string; // 允许预定义类型或自定义类型
  number: string; // 电话号码，支持国际号码格式
}

interface EmailAddress {
  type: "personal" | "work" | "other" | string; // 允许预定义类型或自定义类型
  email: string; // 邮箱地址
}

interface Status {
  online: boolean; // 是否在线
  lastSeen: string | null; // 最近在线时间，ISO 8601 格式，或 null 表示未知
  statusMessage?: string; // 状态消息，可选
}

interface CustomFields {
  [key: string]: string | number | boolean | null; // 动态键值对
}

interface Settings {
  muteNotifications: boolean; // 是否静音此联系人的通知
  favorite: boolean; // 是否标记为收藏
}

interface Contact {
  contactId: string; // 唯一标识符
  userId: string; // 用户唯一标识符
  name: string; // 联系人真实姓名
  nickname?: string; // 联系人昵称，可选
  avatarUrl?: string; // 头像 URL，可选
  phoneNumbers: PhoneNumber[]; // 电话号码列表
  emailAddresses: EmailAddress[]; // 邮件地址列表
  tags: string[]; // 标签列表
  status: Status; // 在线状态
  customFields?: CustomFields; // 用户自定义字段，可选
  addedAt: string; // 添加联系人时间，ISO 8601 格式
  mutualFriendsCount?: number; // 共同好友数量，可选
  settings: Settings; // 联系人设置
  privacySettings?: { // 隐私设置，可选
    shareLastSeen: boolean; // 是否分享最近在线时间
    shareStatusMessage: boolean; // 是否分享状态消息
  };
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