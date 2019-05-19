import { generalExcel } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'excel',

  state: {
  },

  effects: {
    *generalExcel({ payload }, { call }) {
      const response = yield call(generalExcel, payload);

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('获取成功');
          window.open(`http://${window.location.host}/wxQunWeb_war/files/${data.excelFileName}`);
        } else {
          message.error(`服务器获取失败：${data.errInfo}`);
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
