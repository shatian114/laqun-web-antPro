import { deleteSn, getGlobalConf, setGlobalConf } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'globalConf',

  state: {
    conf: {},
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getGlobalConf, payload);

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('查询成功');

          yield put({
            type: 'save',
            payload: {
              conf: data.data,
            },
          });
        } else {
          message.error(`服务器查询失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *set({ payload }, { call }) {
      const response = yield call(setGlobalConf, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('保存成功');
          payload.callback();
        } else {
          message.error(`服务器删除失败：${data.errInfo}`);
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
