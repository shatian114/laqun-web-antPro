import { login, logout } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import router from 'umi/router';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    isLogin: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // Login successfully
      if (response.status === 200) {
        if (response.data.resInfo === '登录成功') {
          yield put({
            type: 'save',
            payload: {
              isLogin: true,
            },
          });
          message.success('登录成功');
          router.push('/');
        } else {
          message.error(response.data.resInfo);
        }
      }
    },

    *logout(_, { call, put }) {
      const response = yield call(logout);
      if (response.status === 200 && response.data.resInfo === '退出成功') {
        yield put({
          type: 'save',
          payload: {
            isLogin: false,
          },
        });
        message.success('退出成功');
        router.push('/user/login');
      } else {
        message.error('退出失败');
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
