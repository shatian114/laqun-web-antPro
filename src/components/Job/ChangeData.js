import React, { PureComponent } from 'react';
import { Form, Card, Button, Select, Input } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class AddFriend extends PureComponent {

  state = {
    countryArr: ['不修改', 'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hong Kong', 'Hubei', 'Hunan', 'Inner Mongolia', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Macao', 'Ningxia', 'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Taiwan', 'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang'],
  }

  releaseJob = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.props.releaseJob(JSON.stringify({...values}));
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    
    return (
      <Card>
        <Form
          labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        >
          <FormItem label='是否修改头像'>
            {getFieldDecorator('isChangeAvatar', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否修改昵称'>
            {getFieldDecorator('isChangeNick', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否修改朋友圈背景'>
            {getFieldDecorator('isChangeBack', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否修改密码'>
            {getFieldDecorator('isChangePassword', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否添加好友验证'>
            {getFieldDecorator('isChangeAddVerify', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='修改地区列表'>
            {getFieldDecorator('isChangeCountry', {
              initialValue: '不修改',
            })(
              <Select>
                {
                  this.state.countryArr.map(v => (
                    <Option key={v} value={v}>{v}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem label='是否修改签名'>
            {getFieldDecorator('isChangeSign', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='修改性别'>
            {getFieldDecorator('isChangeSex', {
              initialValue: '不修改',
            })(
              <Select>
                <Option value='男'>男</Option>
                <Option value='女'>女</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.releaseJob} type="primary">
              发布任务
            </Button>
          </FormItem>
        </Form>

      </Card>
    );
  }
}

export default AddFriend;
