import {request} from '@/utils';

export const postAttachAPI = async (formData, type = 'image') => {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: `/v1/attachment/${type}`,
    method: 'POST',
    data: formData,
  });
};

export const getAttachAPI = async (attachmentId) => {
  return request({
    url: `/v1/attachment/${attachmentId}`,
    method: 'GET',
    responseType: 'blob',
  });
};
