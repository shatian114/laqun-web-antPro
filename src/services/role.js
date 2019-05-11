import request from '@/utils/request';

export async function query() {
  return request('/api/roles');
}

export async function queryCurrent() {
  return request('/api/currentRole');
}
