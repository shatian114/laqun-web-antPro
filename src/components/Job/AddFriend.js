import React, { PureComponent } from 'react';
import { Form, Card, Button, Select, Input } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class AddFriend extends PureComponent {

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
        <Form layout="inline">
          <FormItem label="加人次数">
            {getFieldDecorator('addNum', {
              initialValue: '',
            })(<Input placeholder='请输入加人次数' />)}
          </FormItem>
          <FormItem label='是否看文章'>
            {getFieldDecorator('isViewWenzhang', {
              initialValue: '看',
            })(
              <Select>
                <Option value='看'>看</Option>
                <Option value='不看'>不看</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否拉群'>
            {getFieldDecorator('isLaqun', {
              initialValue: '拉',
            })(
              <Select>
                <Option value='拉'>拉</Option>
                <Option value='不拉'>不拉</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否与互聊微信号聊天'>
            {getFieldDecorator('isLaqun', {
              initialValue: '是',
            })(
              <Select>
                <Option value='是'>是</Option>
                <Option value='否'>否</Option>
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
