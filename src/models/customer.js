import { delCustomer, addCustomer, getCustomer } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'customer',

  state: {
    customerList: [],
    total: 0,
    page: 1,
    pageSize: 10,
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(getCustomer, payload);

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('查询成功');

          yield put({
            type: 'save',
            payload: {
              customerList: data.data,
              total: data.total,
            },
          });
        } else {
          message.error(`服务器查询失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *delete({ payload }, { call }) {
      const response = yield call(delCustomer, payload);

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('删除成功');
          payload.callback();
        } else {
          message.error(`服务器查询失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *addCustomer({ payload }, { call }) {
      const response = yield call(addCustomer, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('添加成功');
          payload.callback();
        } else {
          message.error(`服务器添加失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
