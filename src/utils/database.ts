import SQLite from 'react-native-sqlite-storage';
import {MessageInterface} from '@/store/modules/Messages.ts';

// 打开或创建一个数据库
const db = SQLite.openDatabase(
  {
    name: 'chatDatabase.db',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully');
  },
  (error) => {
    console.error('SQLite error:', error.message);
  }
);

// 定义初始化数据库和表的方法
export const createTable = (): void => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversationId TEXT,
        senderId TEXT,
        recipientId TEXT,
        content TEXT,
        timestamp TEXT,
        isRead INTEGER,
        isRecalled INTEGER DEFAULT 0
      );`,
      [],
      () => console.log('Table created or already exists'),
      (error) => console.error('Error creating table:', error.message)
    );
  });
};

// 插入消息
export const insertMessage = (message: MessageInterface): void => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO messages (conversationId, senderId, recipientId, content, timestamp, isRead) VALUES (?, ?, ?, ?, ?, ?)',
      [
        message.conversationId,
        message.senderId,
        message.recipientId,
        message.content,
        message.timestamp,
        message.isRead ? 1 : 0,
      ],
      (_, results) => console.log('Message inserted with ID:', results.insertId),
      (error) => console.error('Error inserting message:', error.message)
    );
  });
};

// 获取消息
export const getMessages = (conversationId: string, limit: number = 20): void => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp DESC LIMIT ?`,
      [conversationId, limit],
      (_, results) => {
        const rows = results.rows.raw();
        console.log('Messages:', rows);
      },
      (error) => console.error('Error fetching messages:', error.message)
    );
  });
};

// 标记消息为已读
export const markMessageAsRead = (messageId: number): void => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE messages SET isRead = ? WHERE id = ?',
      [1, messageId],
      () => console.log('Message marked as read'),
      (error) => console.error('Error updating message:', error.message)
    );
  });
};

// 撤回消息
export const recallMessage = (messageId: number): void => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE messages SET isRecalled = ? WHERE id = ?',
      [1, messageId],
      () => console.log('Message recalled'),
      (error) => console.error('Error recalling message:', error.message)
    );
  });
};

// 删除消息
export const deleteMessage = (messageId: number): void => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM messages WHERE id = ?',
      [messageId],
      () => console.log('Message deleted'),
      (error) => console.error('Error deleting message:', error.message)
    );
  });
};

// 分页获取消息
export const getMessagesByPage = (
    conversationId: string,
  page: number,
  pageSize: number = 20
): void => {
  const offset = page * pageSize;
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [conversationId, pageSize, offset],
      (_, results) => {
        const rows = results.rows.raw();
        console.log('Messages for page:', rows);
      },
      (error) => console.error('Error fetching messages:', error.message)
    );
  });
};

// 示例方法：存储消息到数据库
export const storeMessage = async (message: MessageInterface): Promise<void> => {
  insertMessage(message);
};

// 示例方法：从数据库加载消息
export const loadMessagesFromDB = async (
  conversationId: string
): Promise<MessageInterface[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM messages WHERE conversationId = ?',
        [conversationId],
        (_, results) => resolve(results.rows.raw() as MessageInterface[]),
      (error) => reject(error)
    );
    });
  });
};

// 示例方法：从数据库加载会话
export const loadConversationsFromDB = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT DISTINCT conversationId FROM messages',
        [],
        (_, results) => resolve(results.rows.raw()),
        (error) => reject(error)
      );
    });
  });
};
