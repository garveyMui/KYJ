import SQLite from 'react-native-sqlite-storage';
import {MessageInterface} from '@/store/modules/Messages.ts';
import {
  ConversationInterface,
  Conversations,
} from '@/store/modules/Conversations.ts';
import {debug, resetDatabase} from '@/appConfig.json';

// 打开或创建一个数据库
const db = SQLite.openDatabase(
  {
    name: 'chatDatabase.db',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.error('SQLite error:', error.message);
  },
);

// 定义初始化数据库和表的方法
export const createTable = (): void => {
  db.transaction(tx => {
    if (debug && resetDatabase) {
      tx.executeSql(
        'DROP INDEX IF EXISTS idx_isGroup',
        [],
        () => console.log('Successfully deleted index: idx_isGroup'),
        error => console.error('Error deleting index idx_isGroup:', error.message),
      );
      tx.executeSql(
        'DROP INDEX IF EXISTS idx_convId',
        [],
        () => console.log('Successfully deleted index: idx_convId'),
        error => console.error('Error deleting index idx_convId:', error.message),
      );
      tx.executeSql(
        'DROP TABLE IF EXISTS conversations',
        [],
        () => console.log('Successfully deleted table: conversations'),
        error => console.error('Error deleting table conversations:', error.message),
      );
      tx.executeSql(
        'DROP INDEX IF EXISTS idx_conversationId',
        [],
        () => console.log('Successfully deleted index: idx_conversationId'),
        error => console.error('Error deleting index idx_conversationId:', error.message),
      );
      tx.executeSql(
        'DROP TABLE IF EXISTS messages',
        [],
        () => console.log('Successfully deleted table: messages'),
        error => console.error('Error deleting table messages:', error.message),
      );
    }
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS conversations (
        lastUpdateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        conversationId TEXT,
        unreadCountTotal INTEGER,
        isGroup INTEGER,
        isMuted INTEGER,
        avatar TEXT,
        peerId TEXT DEFAULT '',
        displayName TEXT,
        lastMessageAbstract TEXT DEFAULT '',
        groupInfo TEXT DEFAULT '{}',
        extra TEXT DEFAULT '{}',
        PRIMARY KEY (lastUpdateTime, conversationId)
        );`,
      [],
      () => console.log('Conversations table created or already exists'),
      error =>
        console.error('Error creating conversations table:', error.message),
    );
    tx.executeSql(
      `CREATE INDEX IF NOT EXISTS idx_isGroup ON conversations (unreadCountTotal);`
    );
    tx.executeSql(
      `CREATE INDEX IF NOT EXISTS idx_convId ON conversations (conversationId);`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        timestamp DATETIME,
        conversationId TEXT,
        messageId TEXT,
        senderId TEXT,
        isRead INTEGER DEFAULT 0,
        isRecalled INTEGER DEFAULT 0,
        recalledBy INTEGER DEFAULT -1,
        recallTime DATETIME DEFAULT '',
        mentions TEXT DEFAULT '',
        content TEXT,
        extra TEXT DEFAULT '',
        PRIMARY KEY (timestamp, conversationId, messageId),
        FOREIGN KEY (conversationId) REFERENCES conversations(conversationId)
      );`,
      [],
      () => console.log('Table created or already exists'),
      error => console.error('Error creating table:', error.message),
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_conversationId ON messages (conversationId)',
      [],
      () => console.log('Index created or already exists'),
      error => console.error('Error creating index:', error.message),
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
         userid TEXT,
         displayName TEXT,
         avatar TEXT,
         PRIMARY KEY (userid)
       )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS contacts (
          userid TEXT,
          nickname TEXT,
          addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          tags TEXT,
          email TEXT,
          isMuted INTEGER DEFAULT 0,
          isFavorite INTEGER DEFAULT 0,
          PRIMARY KEY (addedAt, userid),
          FOREIGN KEY (userid) REFERENCES users(userid)
       )`,
      [],
      () => console.log('Contacts table created or already exists'),
      error =>
        console.error('Error creating contacts table:', error.message),
    );
     tx.executeSql(
      `CREATE TABLE IF NOT EXISTS docs(
        timestamp DATETIME,
        messageId TEXT,
        fileName TEXT,
        senderId TEXT,
        isRead INTEGER DEFAULT 0,
        localPath TEXT,
        extra TEXT DEFAULT '',
        PRIMARY KEY (timestamp, messageId),
        FOREIGN KEY (senderId) REFERENCES users(userid)
      )`,
      [],
      () => console.log('Docs table created or already exists'),
      error => console.error('Error creating docs table:', error.message),
    );
  });
};

// 插入消息 还需要一个表存储可能在没有网络的情况下的主动消息
export const insertMessages = (messages: MessageInterface[]): void => {
  db.transaction(tx => {
    messages.forEach(message => {
      const {
        messageId,
        conversationId,
        sender: {id: suid},
        content,
        timestamp,
        status: {isRead, isRecalled, recalledBy, recallTime},
        mentions,
      } = message;
      // // 格式化 recipient 为字符串（处理群聊）
      // const recipientIds = Array.isArray(recipient)
      //   ? recipient.map(r => r.userId).join(',')
      //   : recipient.userId;
      // 格式化 content 为字符串
      const contentStr = JSON.stringify(content);
      tx.executeSql(
        'INSERT INTO messages (' +
        'timestamp, conversationId, messageId, senderId, isRead, ' +
        'isRecalled, recalledBy, recallTime, mentions, content' +
        ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          timestamp,
          conversationId,
          messageId,
          suid,
          isRead,
          isRecalled,
          recalledBy ? recalledBy : -1,
          recallTime ? recallTime : -1,
          mentions ? mentions.join(',') : '',
          contentStr,
        ],
        (_, results) =>
          console.log('Message inserted with ID:', results.insertId),
        error => console.error('Error inserting message:', error.message),
      );
    });
  });
};

// 插入会话
export const insertConversation = (
  conversation: ConversationInterface,
): void => {
  const {
    chatObject: {displayName, avatar, id: peerId},
    conversationId,
    lastUpdateTime,
    unreadCountTotal,
    isGroup,
    isMuted,
    groupInfo,
    lastMessageAbstract,
  } = conversation;

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO conversations (' +
      'lastUpdateTime, conversationId, unreadCountTotal, isGroup, isMuted, ' +
      'avatar, peerId, displayName, lastMessageAbstract, groupInfo' +
      ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        lastUpdateTime,
        conversationId,
        unreadCountTotal,
        isGroup ? 1 : 0,
        isMuted ? 1 : 0,
        avatar,
        peerId,
        displayName,
        lastMessageAbstract,
        groupInfo ? JSON.stringify(groupInfo) : '{}',
      ],
      (_, results) =>
        console.log('Conversation inserted with ID:', results.insertId),
      error => console.error('Error inserting conversation:', error.message),
    );
  });
};

// 获取消息
export const getMessages = (
  conversationId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<MessageInterface[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
        [conversationId, limit, offset],
        // `SELECT * FROM messages`,
        // [],
        (_, results) => {
          const rows = results.rows.raw();
          const messages: MessageInterface[] = rows.map((row: any) => ({
            messageId: row.messageId,
            conversationId: row.conversationId,
            sender: {id: row.senderId}, // 需要填充完整的用户信息
            timestamp: row.timestamp,
            status: {
              delivered: row.delivered,
              isRead: row.isRead,
              isRecalled: row.isRecalled,
              recalledBy: row.recalledBy,
              recallTime: row.recallTime,
            },
            mentions: row.mentions ? row.mentions.split(',') : [],
            content: JSON.parse(row.content), // 解析消息内容
          }));
          console.log('here', rows[0].conversationId);
          resolve(messages);
        },
        error => reject(error),
      );
    });
  });
};
// 分页获取消息
export const getMessagesByPage = async (
  conversationId: string,
  page: number = 0,
  pageSize: number = 20,
): Promise<MessageInterface[]> => {
  const offset = page * pageSize;
  // 调用getMessages，直接传递分页的参数
  // 计算分页后的消息
  try {
    const messages = await getMessages(conversationId, pageSize, offset);
    return messages;
  } catch (error) {
    console.error('Error getting messages by page:', error);
    throw error;
  }
};
// 从数据库加载消息
export const loadMessagesFromDB = async (
  conversationId: string,
): Promise<MessageInterface[]> => {
  return new Promise((resolve, reject) => {
    try {
      const messages = getMessagesByPage(conversationId, 0, 20);
      resolve(messages);
    } catch (error) {
      reject(error);
    }
  });
};
// 标记消息为已读
export const markMessageAsRead = (messageId: number): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE messages SET isRead = ? WHERE id = ?',
      [1, messageId],
      () => console.log('Message marked as read'),
      error => console.error('Error updating message:', error.message),
    );
  });
};

export const markConversationAsRead = async (conversationId: string): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE conversations SET unreadCountTotal =? WHERE conversationId =?',
      [0, conversationId],
      (_, result) => {
        console.log(`${conversationId} Conversation marked as read`);
        console.log(`rows affected: ${result.rowsAffected}`);
      },
      error => console.error('Error updating message:', error.message),
    );
  });
};

// 撤回消息
export const recallMessage = (messageId: number): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE messages SET isRecalled = ? WHERE id = ?',
      [1, messageId],
      () => console.log('Message recalled'),
      error => console.error('Error recalling message:', error.message),
    );
  });
};

// 删除消息
export const deleteMessage = (messageId: number): void => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM messages WHERE id = ?',
      [messageId],
      () => console.log('Message deleted'),
      error => console.error('Error deleting message:', error.message),
    );
  });
};

// 示例方法：存储消息到数据库
export const storeMessage = async (
  message: MessageInterface,
): Promise<void> => {
  insertMessage(message);
};

// 从数据库加载会话
export const loadConversationsFromDB = async (): Promise<Conversations> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM conversations',
        [],
        async (_, results) => {
          const raws = results.rows.raw();
          console.log('conversations length: ', raws.length);
          const conversationsObj: Conversations = {};
          const pageSize = 20;
          const currentPage = 0;
          // 创建一个数组来存储所有的 Promise
          const promises = raws.map(async (row: any) => {
            const conversationId = row.conversationId;
            try {
              const messages = await getMessagesByPage(conversationId, currentPage, pageSize);
              console.log('load messages from DB: ', messages);
              conversationsObj[conversationId] = {
                lastUpdateTime: row.lastUpdateTime,
                conversationId: row.conversationId,
                unreadCountTotal: row.unreadCountTotal,
                isGroup: row.isGroup,
                isMuted: row.isMuted,
                chatObject: {
                  id: row.peerId,
                  displayName: row.displayName,
                  avatar: row.avatar,
                  conversationId: row.conversationId,
                },
                lastMessageAbstract: row.lastMessageAbstract,
                groupInfo: JSON.parse(row.groupInfo),
                messages: messages,
                currentPage: 1,
                totalPages: 1,
              };
            } catch (error) {
              reject(error); // 捕获错误并结束 promise
            }
          });
          // 等待所有 Promise 完成
          try {
            await Promise.all(promises);
            resolve(conversationsObj); // 所有操作完成后，调用 resolve
          } catch (error) {
            reject(error); // 如果某个 Promise 失败，进入这里
          }
        },
        error => reject(error),
      );
    });
  });
};
