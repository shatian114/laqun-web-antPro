export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    
    routes: [
      { path: '/', redirect: '/wxQunWeb/snMgr' },
      {
        path: '/wxQunWeb/SnMgr',
        name: '手机sn管理',
        component: './wxQunWeb/SnMgr',
      },
      {
        path: '/wxQunWeb/SnGroupMgr',
        name: '手机sn组管理',
        component: './wxQunWeb/SnGroupMgr',
      },
      {
        path: '/wxQunWeb/GlobalConfMgr',
        name: '全局配置',
        component: './wxQunWeb/GlobalConfMgr',
      },
      // {
      //   path: '/wxQunWeb/PhoneAppMgr',
      //   name: '手机APP管理',
      //   component: './wxQunWeb/PhoneAppMgr',
      // },
      // {
      //   path: '/wxQunWeb/CustomerMgr',
      //   name: '客户管理',
      //   component: './wxQunWeb/CustomerMgr',
      // },
      {
        path: '/wxQunWeb/IpMgr',
        name: 'IP管理',
        component: './wxQunWeb/IpMgr',
      },
      {
        path: '/wxQunWeb/LoginWxMgr',
        name: '登录微信管理',
        component: './wxQunWeb/LoginWxMgr',
      },
      {
        path: '/wxQunWeb/NewsMgr',
        name: '新闻管理',
        component: './wxQunWeb/NewsMgr',
      },
      {
        path: '/wxQunWeb/TalkChatRoomMgr',
        name: '群聊管理',
        component: './wxQunWeb/TalkChatRoomMgr',
      },
      {
        path: '/wxQunWeb/ResourcesMgr',
        name: '资源管理',
        routes: [
          {
            path: '/wxQunWeb/ResourcesMgr/TextResourcesMgr',
            name: '文本资源管理',
            component: './wxQunWeb/TextResourcesMgr',
          },
          {
            path: '/wxQunWeb/ResourcesMgr/ImgResourcesMgr',
            name: '图片资源管理',
            component: './wxQunWeb/ImgResourcesMgr',
          },
        ],
      },
      {
        path: '/wxQunWeb/AddWxMgr',
        name: '添加微信管理',
        component: './wxQunWeb/AddWxMgr',
      },
      {
        path: '/wxQunWeb/AddLaQunMgr',
        name: '添加拉群管理',
        component: './wxQunWeb/AddLaQunMgr',
      },
      {
        path: '/wxQunWeb/JobMgr',
        name: '任务管理',
        component: './wxQunWeb/JobMgr',
      },
      {
        path: '/wxQunWeb/GetExcel',
        name: '获取报表',
        component: './wxQunWeb/GetExcel',
      },
      {
        path: '/wxQunWeb/LaQunHistory',
        name: '拉群历史',
        component: './wxQunWeb/LaQunHistory',
      },
      {
        path: '/wxQunWeb/AddWxHistory',
        name: '添加微信历史',
        component: './wxQunWeb/AddWxHistory',
      },
      {
        component: '404',
      },
    ],
  },
];
