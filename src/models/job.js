import { releaseJob } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'job',

  state: {
  },

  effects: {
    *release({ payload }, { call }) {
      const response = yield call(releaseJob, payload);

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('发布成功');
          
        } else {
          message.error(`服务器发布失败：${data.errInfo}`);
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
