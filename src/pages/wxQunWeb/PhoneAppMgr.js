import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Spin, Upload } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ phoneApp, loading }) => ({
  phoneApp,
  geting: loading.effects['phoneApp/getAppVer'],
  adding: loading.effects['phoneApp/addApp'],
}))
@Form.create()
class GlobalConfMgr extends PureComponent {
  componentDidMount = () => {
    this.getAppVer();
  };

  getAppVer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'phoneApp/getAppVer',
      payload: {},
    });
  };

  addApp = () => {
    const { phoneApp, form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'phoneApp/addApp',
          payload: {
            ...values,
            appFile: phoneApp.appFile,
            callback: this.getAppVer,
          },
        });
      }
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'phoneApp/save',
      payload: {
        appFile: file.fileList[0].originFileObj,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      geting,
      adding,
      phoneApp,
    } = this.props;
    return (
      <Card>
        <Spin spinning={geting}>
          <Form layout="inline">
            <FormItem label="APP版本:">
              {getFieldDecorator('appVer', {
                initialValue: phoneApp.appVer || '',
              })(<Input placeholder="请输入APP版本号" />)}
            </FormItem>
            <FormItem style={{ marginLeft: '200px' }} label="添加APP新版本文件">
              <Upload
                beforeUpload={() => {
                  return false;
                }}
                onChange={this.selectFile}
              >
                <Button>选择APP文件</Button>
              </Upload>
            </FormItem>
            <FormItem>
              <Button icon="file-add" type="primary" onClick={this.addApp} loading={adding}>
                添加
              </Button>
            </FormItem>
          </Form>
        </Spin>
      </Card>
    );
  }
}

export default GlobalConfMgr;
