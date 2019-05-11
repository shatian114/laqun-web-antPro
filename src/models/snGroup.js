import { getSnGroup, deleteSn, addSnGroup, delSnGroup } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'snGroup',

  state: {
    snGroupList: [],
    total: 0,
    page: 1,
    pageSize: 10,
    operateType: 'add',
    visibleOperate: false,
    groupName: '',
    groupMember: [],
    isSelectAll: false,
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(getSnGroup, payload);
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
              snGroupList: data.data,
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
      const response = yield call(delSnGroup, payload);
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
    *add({ payload }, { call, put, select }) {
      const response = yield call(addSnGroup, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success(`操作成功`);
          yield put({
            visibleOperate: false,
          });
          payload.callback(
            1,
            yield select(state => state.sn.page),
            yield select(state => state.sn.pageSize)
          );
        } else {
          message.error(`服务器操作失败：${data.errInfo}`);
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
