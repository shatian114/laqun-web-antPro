import React, { PureComponent } from 'react';
import { Form, Card, Select, Button } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
class GetExcel extends PureComponent {

  generalExcel = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        dispatch({
          type: 'excel/generalExcel',
          payload: {
            ...values
          }
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    
    return (
      <Card>
        <Form
          labelCol={{ xs: { span: 24 }, sm: { span: 2 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 22 } }}
        >
          <FormItem label="请选择类型">
            {getFieldDecorator('excelType', {
              initialValue: '已拉完的群',
            })(
              <Select style={{ width: 150 }}>
                <Option value='已拉完的群'>已拉完的群</Option>
                <Option value='未拉完的群'>未拉完的群</Option>
              </Select>
            )}
          </FormItem>
          
          <FormItem>
            <Button onClick={this.generalExcel} type='primary'>
              开始生成报表
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default GetExcel;
