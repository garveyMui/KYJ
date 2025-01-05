import { request } from '@/utils/request';

export const createGroupAPI = async (uid, group) => {
  return request({
    url: `/v1/groups/${uid}/create`,
    method: 'POST',
    data: group,
  });
};

export const getGroupAPI = async (group_id, group) => {
  return request({
    url: `/v1/groups/${group_id}/members`,
    method: 'GET',
  });
}