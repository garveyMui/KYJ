import {webSocket} from '@/utils/webSocket';
import {request} from '@/utils/request';
import {postAttachAPI} from '@/apis/attachments';

export const getMessageAPI = async (uid, page) => {
  return request({
    url: `/v1/messages/${uid}?page=${page}`,
    method: 'GET',
  });
};

export const getMessageUnreadAPI = async (uid, page) => {
  return request({
    url: `/v1/messages/${uid}/unread?page=${page}`,
    method: 'GET',
  });
};

export const postMessageAPI = async (message) => {
  webSocket.send(message);
};
