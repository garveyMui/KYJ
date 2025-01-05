import {request} from '@/utils/request';

export async function getProfileAPI(uid) {
  return request({
    url: `/v1/user/profile?user_id=${uid}`,
    method: 'GET',
  });
}

export async function getSettingsAPI() {
  return request({
    url: `/v1/user/settings`,
    method: 'GET',
  });
}

export async function updateSettingsAPI(settings) {
  return request({
    url: `/v1/user/settings`,
    method: 'PUT',
    data: settings,
  });
}
