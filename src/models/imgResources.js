import { delImg, clearImg, addImgResources, getImgList, test } from '@/services/api';
import { message } from 'antd';
import { uploadImg, delMultiImg } from '@/utils/uploadImg';

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
    *test({ payload }, { call }) {
      const response = yield call(test, payload);
      console.log(response);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          message.success('查询成功');
          
        } else {
          message.error(`服务器查询失败：${data.errInfo}`);
        }
      } else {
        message.error('连接服务器失败');
      }
    },
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
      let delImgKeyArr = [];
      let response = yield call(clearImg, payload);
      if (response.status === 200) {
        const { data } = response;
        if (data.res === 'success') {
          //清理图片仓库的
          delImgKeyArr = data.data;
          while(delImgKeyArr.length !== 0){
            const delImgKeyArrTmp = delImgKeyArr.splice(0, 1000);
            console.log('del res: ', yield call(delMultiImg, delImgKeyArrTmp, payload.resourceType));
          }
          message.success('图片清理成功，准备上传...');
        } else {
          message.error(`服务器清理失败：${data.errInfo}`);
        }

        //开始上传
        let upOkArr = [];
        const imgArr = yield select(state => state.imgResources.imgResourcesFileArr);
        for (let i = 0; i < imgArr.length; i += 1) {
          const upRes = yield call(uploadImg, {img: imgArr[i].originFileObj, imgPath: `${i}.jpg`, resourceType: payload.resourceType});
          if(upRes) {
            message.success(`第${i+1}个图片上传成功`);
            upOkArr.push(`${i}.jpg`);
          }
        }
        message.success('全部图片上传完成');
        response = yield call(addImgResources, {resourceType: payload.resourceType, imgKeyArr: upOkArr.join(',')});
        if (response.status === 200) {
          const { data } = response;
          if (data.res === 'success') {
            message.success('上传成功');
            payload.callback(
              1,
              yield select(state => state.imgResources.page),
              yield select(state => state.imgResources.pageSize)
            );
          } else {
            message.error(`服务器上传失败：${data.errInfo}`);
          }
        } else {
          message.error('连接服务器失败');
        }
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
