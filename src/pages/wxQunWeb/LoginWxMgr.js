import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Popconfirm, Upload, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loginWx, loading }) => ({
  loginWx,
  searching: loading.effects['loginWx/search'],
  adding: loading.effects['loginWx/add'],
  deleteing: loading.effects['loginWx/delete'],
  operateing: loading.effects['loginWx/operate'],
}))
@Form.create()
class LoginWxMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'loginWx/search',
          payload: {
            wxName: values.searchWxName,
            page: page,
            pageSize: pageSize,
          },
        });
      }
    });
  };

  delete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'loginWx/delete',
      payload: {
        wxid: record.wxid,
        callback: this.search,
      },
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'loginWx/save',
      payload: {
        loginWxFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, loginWx } = this.props;
    dispatch({
      type: 'loginWx/add',
      payload: {
        file: loginWx.loginWxFile,
        callback: this.search,
      },
    });
  };

  operate = (e, operateType) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'loginWx/operate',
          payload: {
            operateType: operateType,
            wxState: values.wxState,
            callback: this.search,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      loginWx,
      deleteing,
      adding,
      operateing,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '微信号',
        dataIndex: 'wxName',
        key: 1,
      },
      {
        title: 'wxid',
        dataIndex: 'wxid',
        key: 2,
        editable: true,
      },
      {
        title: '微信密码',
        dataIndex: 'wxPassword',
        key: 3,
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        key: 4,
      },
      {
        title: '获取添加微信资源数量',
        dataIndex: 'addNum',
        key: 5,
      },
      {
        title: '目前好友数量',
        dataIndex: 'friendNum',
        key: 6,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 7,
      },
      {
        title: '手机SN',
        dataIndex: 'sn',
        key: 8,
      },
      {
        title: '操作',
        key: 9,
        render: (text, record) => (
          <Button.Group size="small">
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => {
                this.delete(record);
              }}
            >
              <Button icon="delete" loading={deleteing}>
                删除
              </Button>
            </Popconfirm>
          </Button.Group>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="查询微信">
            {getFieldDecorator('searchWxName', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的微信" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '150px' }} label="添加登录微信">
            <Upload
              beforeUpload={() => {
                return false;
              }}
              onChange={this.selectFile}
            >
              <Button>选择登录微信文件</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
          <FormItem label="操作相关微信状态" style={{ marginLeft: '150px' }}>
            {getFieldDecorator('wxState', {
              initialValue: '密码错误',
            })(
              <Select>
                <Option value="密码错误">密码错误</Option>
                <Option value="新机">新机</Option>
                <Option value="封号">封号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button
              icon="export"
              type="primary"
              onClick={() => {
                this.operate(this, 'download');
              }}
              loading={operateing}
            >
              导出
            </Button>
          </FormItem>
          <FormItem>
            <Button
              icon="delete"
              type="primary"
              onClick={() => {
                this.operate(this, 'del');
              }}
              loading={operateing}
            >
              删除
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={loginWx.loginWxList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: loginWx.total,
            showSizeChanger: true,
            onShowSizeChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
          }}
        />
      </Card>
    );
  }
}

export default LoginWxMgr;
