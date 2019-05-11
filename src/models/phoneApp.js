import { getPhoneAppVer, addPhoneApp } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'phoneApp',

  state: {
    appFile: {},
    appVer: '',
  },

  effects: {
    *getAppVer(_, { call, put }) {
      const response = yield call(getPhoneAppVer);

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('查询成功');

          yield put({
            type: 'save',
            payload: {
              appVer: data.appVer,
            },
          });
        } else {
          message.error(`服务器查询失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *addApp({ payload }, { call }) {
      const formData = new FormData();
      formData.append('appFile', payload.appFile);
      formData.append('appVer', payload.appVer);
      const response = yield call(addPhoneApp, formData);
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
