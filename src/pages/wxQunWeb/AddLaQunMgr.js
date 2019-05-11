import React, { PureComponent } from 'react';
import { Form, Card, Button, Table, Popconfirm, Upload, Select, Input } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ customer, addWx, loading }) => ({
  customer,
  addWx,
  customerSearching: loading.effects['customer/search'],
  searching: loading.effects['addWx/search'],
  deleteing: loading.effects['imgResources/delete'],
  adding: loading.effects['imgResources/add'],
}))
@Form.create()
class AddWxMgr extends PureComponent {
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
          <FormItem label="选择客户">
            {getFieldDecorator('customer', {
              initialValue: '',
            })(
              <Select style={{ width: 140 }} onChange={this.changeType} loading={customerSearching}>
                {customer.customerList.map(v => (
                  <Option value={v.name} key={v.name}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="查询手机">
            {getFieldDecorator('searchPhone', {
              initialValue: '',
            })(<Input placeholder="请输入查询的手机号" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="选择手机号文件">
            <Upload
              multiple={false}
              beforeUpload={() => {
                return false;
              }}
              onChange={this.selectFile}
            >
              <Button>点我选择</Button>
            </Upload>
          </FormItem>
          <FormItem label="优先级">
            {getFieldDecorator('selectPriority', {
              initialValue: 1,
            })(
              <Select style={{ width: 50 }} onChange={this.changeType} loading={customerSearching}>
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
                <Option value={3}>3</Option>
                <Option value={4}>4</Option>
                <Option value={5}>5</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={addWx.addWxList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: addWx.total,
          }}
        />
      </Card>
    );
  }
}

export default AddWxMgr;
