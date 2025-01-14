import {createHash} from 'crypto';

/**
 * 根据参与者的uid生成conversationId
 * @param uids 参与者的uid数组
 * @returns 生成的conversationId
 */
function generateConversationId(uids: string[]): string {
  // 步骤1: 排序参与者的uid
  uids.sort();

  // 步骤2: 拼接排序后的uid数组
  const concatenatedString = uids.join(',');

  // 步骤3: 使用SHA-256对拼接后的字符串进行哈希计算
  const hash = createHash('sha256');
  hash.update(concatenatedString);

  // 步骤4: 返回哈希值的十六进制表示作为conversationId
  return hash.digest('hex');
}

// 示例使用
const uids = ['user3', 'user1', 'user2'];
const conversationId = generateConversationId(uids);
console.log(conversationId);
