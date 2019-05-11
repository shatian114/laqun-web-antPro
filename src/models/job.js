import { getAddWx, delAddWx, addAddWx } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'job',

  state: {
    addWxList: [],
    addWxFile: [],
    total: 0,
    page: 1,
    pageSize: 10,
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(getAddWx, payload);

      yield put({
        type: 'save',
        payload: {
          page: payload.page,
          pageSize: payload.pageSize,
        },
      });

      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('查询成功');
          for (let i = 0; i < data.data.length; i += 1) {
            data.data[i].key = i;
          }
          yield put({
            type: 'save',
            payload: {
              addWxList: data.data,
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
    *delete({ payload }, { call, select }) {
      const response = yield call(delAddWx, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('删除成功');
          payload.callback(
            1,
            yield select(state => state.addWx.page),
            yield select(state => state.addWx.pageSize)
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
      formData.append('priority', payload.priority);
      formData.append('customer', payload.customer);
      const response = yield call(addAddWx, formData);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success(`添加成功，${data.saveCount}个`);
          payload.callback(
            1,
            yield select(state => state.sn.page),
            yield select(state => state.sn.pageSize)
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
