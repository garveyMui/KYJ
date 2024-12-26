import {request} from './request';

export async function logginAPI(formData) {
  return await request({
    url: '/api/user/login',
    method: 'POST',
    data: formData,
  });
}

export async function getProfileAPI() {
  return await request({
    url: '/api/user/profile',
    method: 'GET',
  });
}
