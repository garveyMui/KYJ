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
