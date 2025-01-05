import {request} from '@/utils';

export async function registerAPI(formData) {
  return request({
    url: '/v1/auth/register',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function logginAPI(formData) {
  return request({
    url: '/v1/auth/login',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function logoutAPI() {
  return request({
    url: '/v1/auth/logout',
    method: 'POST',
  });
}
