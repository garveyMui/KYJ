import { request } from '@/utils/request';

export async function getContacts() {
  return request({
    url: '/v1/contacts',
    method: 'GET',
  });
}