import { delImg, clearImg, addImgResources, getImgList } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'imgResources',

  state: {
    imgResourcesList: [],
    imgResourcesFileArr: [],
    total: 0,
    page: 1,
    pageSize: 10,
    resourceType: 'avatar',
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(getImgList, payload);

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
              imgResourcesList: data.data,
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
      const response = yield call(delImg, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('删除成功');
          payload.callback(
            1,
            yield select(state => state.imgResources.page),
            yield select(state => state.imgResources.pageSize)
          );
        } else {
          message.error(`服务器删除失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
    *add({ payload }, { call, select }) {
      let response = yield call(clearImg, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('图片清理成功，准备上传...');
        } else {
          message.error(`服务器清理失败：${data.errInfo}`);
        }
        const imgArr = yield select(state => state.imgResources.imgResourcesFileArr);
        for (let i = 0; i < imgArr.length; i += 1) {
          const formData = new FormData();
          formData.append('imgFile', imgArr[i].originFileObj);
          formData.append('resourceType', payload.resourceType);
          response = yield call(addImgResources, formData);
          if (response.status === 200) {
            const { data } = response;
            if (data.res === 'success') {
              message.success(`第${i + 1}个图片上传成功`);
            } else {
              message.error(`上传第${i + 1}个图片失败：${data.errInfo}`);
            }
          } else {
            message.error(`上传第${i + 1}个图片时，连接服务器失败`);
          }
        }
        payload.callback(
          1,
          yield select(state => state.imgResources.page),
          yield select(state => state.imgResources.pageSize)
        );
      } else {
        message.error('清理图片时，连接服务器失败');
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
