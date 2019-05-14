import { message } from 'antd';
import axios from 'axios';
import {webConfig} from './Constant';
import {getCosSigner} from '../services/api';

const COS = require('cos-js-sdk-v5');

// const cos = new COS({
//   'getAuthorization': function(options, callback) {
//     getCosSigner({key: options.Pathname}).then(v => {
//       console.log(`sign: ${v.data.sign}`);
//       callback({
// 				Authorization: v.data.sign,
// 			});
//     }).then(v2 => {
      
//     }).catch(err => {
//       message.error('获取上传图片的签名失败');
//     });
//   },
// });

const cos = new COS({
  SecretId: 'AKIDpRq9D1nI50jLQLeiKhdAXLF8ORoG5FWa',
  SecretKey: 'BD4NSL3ZtztJYYMy1sGXZOyMAoEON6bq',
});

export function uploadImg(param) {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: `${param.resourceType.toLowerCase()}${webConfig.Bucket}`,
        Region: webConfig.Region,
        Key: param.imgPath,
        Body: param.img,
      },
      (err, data) => {
        if (data) {
          resolve(true)
          //图片上传成功
          //console.log('upload code: ', data);
        } else {
          reject(false);
          //图片上传失败
          console.log('img upload fail: ', err);
        }
      }
    );
  });
}

export function delMultiImg(delImgKeyArr, resourceType) {
  return new Promise((resolve, reject) => {
    console.log('Bucket: ', `${resourceType.toLowerCase()}${webConfig.Bucket}`);
    cos.deleteMultipleObject({
      Bucket: `${resourceType.toLowerCase()}${webConfig.Bucket}`,
      Region: webConfig.Region,
      Quiet: true,
      Objects: delImgKeyArr
    }, function(err, data) {
      if(!err) {
        console.log(`del success: `, data);
        resolve(data);
      }else{
        console.log(`del err: `, err);
        reject(err);
      }
    });
  });
}

export function ugcGetSign(callback) {
  return axios.get('https://qqphoto.cn/pet/pet?command=getuploadsignaturevideo', { param: {} })
    .then(res => {
      console.log('ugcGetSign: ', res.data);
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
}

//上传视频，参数：视频文件
export async function uploadUgc(ugcFile, progressCall) {
  console.log('开始上传视频');
  const tcVod = new TcVod.default({
    getSignature: ugcGetSign
  });
  const uploader = tcVod.upload({
    videoFile: ugcFile
  });
  return new Promise((resolve, reject) => {
    uploader.on('video_progress', function(info) {
      console.log('upload video: ', info.percent);
      progressCall(info.percent * 100);
    });
    uploader.done().then(res => {
      console.log('视频上传完成： ', res);
      resolve(res);
    });
  });
  
}