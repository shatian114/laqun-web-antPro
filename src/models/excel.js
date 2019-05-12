import { getNews, delNews, addNews } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'excel',

  state: {
  },

  effects: {
    *generalExcel({ payload }, { call }) {
      const response = yield call(getNews, payload);

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
    *delete({ payload }, { call, select }) {
      const response = yield call(delNews, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('删除成功');
          payload.callback(
            1,
            yield select(state => state.news.page),
            yield select(state => state.news.pageSize)
          );
        } else {
          message.error(`服务器删除失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *add({ payload }, { call, select }) {
      const formData = new FormData();
      formData.append('txtFile', payload.file);
      const response = yield call(addNews, formData);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success(`添加成功，${data.saveCount}个`);
          payload.callback(
            1,
            yield select(state => state.news.page),
            yield select(state => state.news.pageSize)
          );
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
