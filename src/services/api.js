import { requestPost, requestForm, requestPostTest} from '@/utils/request';

export async function login(data) {
  return requestPost('/login', data);
}

export async function isLogin(data) {
  return requestPost('/isLogin', data);
}

export async function logout() {
  return requestPost('/logout');
}

export async function searchSn(data) {
  return requestPost('/getSn', data);
}

export async function deleteSn(data) {
  return requestPost('/delSn', data);
}

export async function addSn(data) {
  return requestForm('/addSn', data);
}

export async function stopJob(data) {
  return requestPost('/stopJob', data);
}

export async function setRemark(data) {
  return requestPost('/setSnRemark', data);
}

export async function getGlobalConf(data) {
  return requestPost('/getGlobalConf', data);
}

export async function setGlobalConf(data) {
  return requestPost('/setGlobalConf', data);
}

export async function getPhoneAppVer() {
  return requestPost('/getPhoneAppVer');
}

export async function addPhoneApp(data) {
  return requestForm('/addPhoneApp', data);
}

export async function addCustomer(data) {
  return requestPost('/addCustomer', data);
}

export async function getCustomer(data) {
  return requestPost('/getCustomer', data);
}

export async function delCustomer(data) {
  return requestPost('/delCustomer', data);
}

export async function addSnGroup(data) {
  return requestPost('/addSnGroup', data);
}

export async function getSnGroup(data) {
  return requestPost('/getSnGroup', data);
}

export async function delSnGroup(data) {
  return requestPost('/delSnGroup', data);
}

export async function getIp(data) {
  return requestPost('/getIp', data);
}

export async function delIp(data) {
  return requestPost('/delIp', data);
}

export async function addLoginWx(data) {
  return requestForm('/addLoginWx', data);
}

export async function getLoginWx(data) {
  return requestPost('/getLoginWx', data);
}

export async function delLoginWx(data) {
  return requestPost('/delLoginWx', data);
}

export async function operateLoginWx(data) {
  return requestPost('/operateLoginWx', data);
}

export async function addNews(data) {
  return requestForm('/addNews', data);
}

export async function getNews(data) {
  return requestPost('/getNews', data);
}

export async function delNews(data) {
  return requestPost('/delNews', data);
}

export async function addTalkChatRoom(data) {
  return requestForm('/addTalkChatRoom', data);
}

export async function getTalkChatRoom(data) {
  return requestPost('/getTalkChatRoom', data);
}

export async function delTalkChatRoom(data) {
  return requestPost('/delTalkChatRoom', data);
}

export async function getResources(data) {
  return requestPost('/getTextResources', data);
}

export async function delResources(data) {
  return requestPost('/delTextResources', data);
}

export async function addTextResources(data) {
  return requestForm('/addTextResources', data);
}

export async function clearImg(data) {
  return requestPost('/clearImg', data);
}

export async function addImgResources(data) {
  return requestPost('/addImgResources', data);
}

export async function getImgList(data) {
  return requestPost('/getImgList', data);
}

export async function delImg(data) {
  return requestPost('/delImg', data);
}

export async function addAddWx(data) {
  return requestForm('/addAddWx', data);
}

export async function getAddWx(data) {
  return requestPost('/getAddWx', data);
}

export async function delAddWx(data) {
  return requestPost('/delAddWx', data);
}

export async function addAddLaQun(data) {
  return requestForm('/addLaQun', data);
}

export async function getAddLaQun(data) {
  return requestPost('/getLaQun', data);
}

export async function delAddLaQun(data) {
  return requestPost('/delLaQun', data);
}

export async function releaseJob(data) {
  return requestPost('/releaseJob', data);
}

export async function generalExcel(data) {
  return requestPost('/generalExcel', data);
}

export async function getLaQunHistory(data) {
  return requestPost('/getLaQunHistory', data);
}

export async function getAddWxHistory(data) {
  return requestPost('/getAddWxHistory', data);
}

export async function getCosSigner(data) {
  return requestPost('/getImgAuth', data);
}

export async function test(data) {
  return requestPostTest('/getAddWxHistory', data);
}
