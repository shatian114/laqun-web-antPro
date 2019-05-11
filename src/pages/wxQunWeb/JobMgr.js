import React, { PureComponent } from 'react';
import { Form, Card, Button, Table, Popconfirm, Upload, Select, Input, Modal } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ customer, addWx, loading }) => ({
  customer,
  addWx,
  customerSearching: loading.effects['customer/search'],
  searching: loading.effects['addWx/search'],
  deleteing: loading.effects['addWx/delete'],
  adding: loading.effects['addWx/add'],
}))
@Form.create()
class JobMgr extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/search',
      payload: {
        customerName: '',
        page: 1,
        pageSize: 10000,
      },
    });
  };

  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'addWx/search',
          payload: {
            ...values,
            page: page,
            pageSize: pageSize,
          },
        });
      }
    });
  };

  delete = record => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'imgResources/delete',
          payload: {
            fileName: record.val,
            resourcesType: values.resourcesType,
            callback: this.search,
          },
        });
      }
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addWx/save',
      payload: {
        addWxFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, addWx, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'addWx/add',
          payload: {
            customer: values.customer,
            priority: values.selectPriority,
            file: addWx.addWxFile,
            callback: this.search,
          },
        });
      }
    });
  };

  changeType = resourceType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imgResources/save',
      payload: {
        resourceType: resourceType,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      customerSearching,
      searching,
      adding,
      customer,
      addWx,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 1,
      },
      {
        title: '正在使用',
        dataIndex: 'isUse',
        key: 2,
      },
      {
        title: 'wxid',
        dataIndex: 'wxid',
        key: 3,
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        key: 4,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 5,
      },
      {
        title: '省',
        dataIndex: 'province',
        key: 6,
      },
      {
        title: '市',
        dataIndex: 'city',
        key: 7,
      },
      {
        title: '是否被拉',
        dataIndex: 'isLa',
        key: 8,
      },
      {
        title: '被拉的群',
        dataIndex: 'laQunId',
        key: 9,
      },
      {
        title: '被拉时间',
        dataIndex: 'laTime',
        key: 10,
      },
      {
        title: '添加时间',
        dataIndex: 'addTime',
        key: 11,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 12,
      },
      {
        title: '客户',
        dataIndex: 'customer',
        key: 13,
      },
      {
        title: '操作',
        key: 14,
        render: (text, record) => (
          <Button.Group size="small">
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => {
                this.delete(record);
              }}
            >
              {/* <Button icon='delete' loading={deleteing}>删除</Button> */}
            </Popconfirm>
          </Button.Group>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="选择任务类型">
            {getFieldDecorator('job', {
              initialValue: '登录微信',
            })(
              <Select style={{ width: 140 }} onChange={this.changeType} loading={customerSearching}>
                <Option value='登录微信'>登录微信</Option>
                <Option value='添加好友'>添加好友</Option>
                <Option value='修改资料'>修改资料</Option>
                <Option value='养号'>养号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              选择接受任务的手机
            </Button>
          </FormItem>
        </Form>

        <Modal>
          
        </Modal>
      </Card>
    );
  }
}

export default JobMgr;
