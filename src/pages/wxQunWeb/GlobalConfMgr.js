import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Row, Spin, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ globalConf, loading }) => ({
  globalConf,
  geting: loading.effects['globalConf/get'],
  seting: loading.effects['globalConf/set'],
}))
@Form.create()
class GlobalConfMgr extends PureComponent {
  componentDidMount = () => {
    this.get();
  };

  get = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalConf/get',
      payload: {
        key: JSON.stringify({
          loginWxUseTime: '',
          loginWxNum: '',
          ipUseTime: '',
          qunUseTimeout: '',
        }),
      },
    });
  };

  set = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'globalConf/set',
          payload: {
            confJson: JSON.stringify({ ...values }),
            callback: this.get,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      geting,
      seting,
      globalConf,
    } = this.props;
    return (
      <Card>
        <Spin spinning={geting}>
          <Form
            labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
          >
            <FormItem label="IP使用间隔时长(分钟):">
              {getFieldDecorator('ipUseTime', {
                initialValue: globalConf.conf.ipUseTime || '',
              })(<Input placeholder="请输入IP使用间隔时长(分钟)" />)}
            </FormItem>
            <FormItem label="登录微信使用间隔时长(分钟):">
              {getFieldDecorator('loginWxUseTime', {
                initialValue: globalConf.conf.loginWxUseTime || '',
              })(<Input placeholder="请输入登录微信使用间隔时长(分钟)" />)}
            </FormItem>
            <FormItem label="手机登录微信最大数量:">
              {getFieldDecorator('loginWxNum', {
                initialValue: globalConf.conf.loginWxNum || '',
              })(<Input placeholder="请输入手机登录微信最大数量" />)}
            </FormItem>
            <FormItem label="群使用超时时间(分钟):">
              {getFieldDecorator('qunUseTimeout', {
                initialValue: globalConf.conf.qunUseTimeout || '',
              })(<Input placeholder="请输入群使用超时时间(分钟)" />)}
            </FormItem>
            <Row>
              <Col offset={5}>
                <Button icon="save" type="primary" onClick={this.set} loading={seting}>
                  保存
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>
    );
  }
}

export default GlobalConfMgr;
