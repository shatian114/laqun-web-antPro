import { getLaQunHistory } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'laQunHistory',

  state: {
    infoList: [],
    total: 0,
    page: 1,
    pageSize: 10,
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(getLaQunHistory, payload);

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
              snList: data.data,
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
    *setRemark({ payload }, { call, put, select }) {
      const response = yield call(setRemark, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('备注设置成功');
          yield put({
            type: 'save',
            payload: {
              visibleEditRemark: false,
            },
          });
          payload.callback(
            1,
            yield select(state => state.sn.page),
            yield select(state => state.sn.pageSize)
          );
        } else {
          message.error(`服务器设置备注失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *delete({ payload }, { call, select }) {
      const response = yield call(deleteSn, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('删除成功');
          payload.callback(
            1,
            yield select(state => state.sn.page),
            yield select(state => state.sn.pageSize)
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
      const response = yield call(addSn, formData);
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
    *stopJob({ payload }, { call, select }) {
      const response = yield call(stopJob, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success(`停止成功`);
          payload.callback(
            1,
            yield select(state => state.sn.page),
            yield select(state => state.sn.pageSize)
          );
        } else {
          message.error(`服务器停止失败：${data.errInfo}`);
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
    clear() {
      return {
        infoList: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };
    },
  },
};
