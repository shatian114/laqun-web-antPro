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
          <FormItem label="点赞数量">
            {getFieldDecorator('dianzanNum', {
              initialValue: '',
            })(<Input placeholder='请输入点赞数量' />)}
          </FormItem>
          <FormItem label="评论数量">
            {getFieldDecorator('pinglunNum', {
              initialValue: '',
            })(<Input placeholder='请输入评论数量' />)}
          </FormItem>
          <FormItem label="看文章数量">
            {getFieldDecorator('kanwenzhangNum', {
              initialValue: '',
            })(<Input placeholder='请输入看文章数量' />)}
          </FormItem>
          <FormItem label='发朋友圈类型'>
            {getFieldDecorator('fapengyouquanType', {
              initialValue: '文字',
            })(
              <Select>
                <Option value='文字'>文字</Option>
                <Option value='文字和图片'>文字和图片</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='是否互聊'>
            {getFieldDecorator('isTalk', {
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
