import {request} from '@/utils/request';

export async function getContacts() {
  return request({
    url: '/v1/contacts',
    method: 'GET',
  });
};

export async function postContact(contact) {
  return request({
    url: '/v1/contacts',
    method: 'POST',
    data: contact,
  });
};

export async function removeContact(contact) {
  return request({
    url: `/v1/contacts/${contact.id}`,
    method: 'DELETE',
  });
};
