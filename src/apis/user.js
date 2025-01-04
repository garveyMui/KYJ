import {request} from '@/utils/request';

export async function logginAPI(formData) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data: formData,
  });
}

export async function getProfileAPI() {
  return request({
    url: '/api/user/profile',
    method: 'GET',
  });
}
