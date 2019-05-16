import React, { PureComponent } from 'react';
import { Form, Card, Button, Table, Popconfirm, Upload, Select, Input } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ customer, addLaQun, loading }) => ({
  customer,
  addLaQun,
  customerSearching: loading.effects['customer/search'],
  searching: loading.effects['addLaQun/search'],
  deleteing: loading.effects['addLaQun/delete'],
  adding: loading.effects['addLaQun/add'],
}))
@Form.create()
class AddWxMgr extends PureComponent {
  componentDidMount = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'customer/search',
    //   payload: {
    //     customerName: '',
    //     page: 1,
    //     pageSize: 10000,
    //   },
    // });
  };

  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'addLaQun/search',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'addLaQun/delete',
      payload: {
        // customer: record.customer,
        qunQr: record.qunQr,
        callback: this.search,
      },
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addLaQun/save',
      payload: {
        addLaQunFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, addLaQun, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'addLaQun/add',
          payload: {
            // customer: values.customer,
            priority: values.selectPriority,
            file: addLaQun.addLaQunFile,
            callback: this.search,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      customerSearching,
      searching,
      adding,
      deleteing,
      customer,
      addLaQun,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '群二维码',
        dataIndex: 'qunQr',
        key: 1,
      },
      {
        title: '群ID',
        dataIndex: 'qunid',
        key: 2,
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        key: 4,
      },
      {
        title: '已经拉的数量',
        dataIndex: 'laedNum',
        key: 5,
      },
      {
        title: '剩余拉的数量',
        dataIndex: 'canLaNum',
        key: 6,
      },
      {
        title: '群成员数量',
        dataIndex: 'friendNum',
        key: 7,
      },
      {
        title: '群是否异常',
        dataIndex: 'isBad',
        key: 8,
      },
      {
        title: '最后获取时间',
        dataIndex: 'lastGetTimeStr',
        key: 9,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 10,
      },
      // {
      //   title: '客户',
      //   dataIndex: 'customer',
      //   key: 11,
      // },
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
              <Button icon='delete' loading={deleteing}>删除</Button>
            </Popconfirm>
          </Button.Group>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          {/* <FormItem label="选择客户">
            {getFieldDecorator('customer', {
              initialValue: '',
            })(
              <Select style={{ width: 140 }} loading={customerSearching}>
                {customer.customerList.map(v => (
                  <Option value={v.name} key={v.name}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
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
          <FormItem style={{ marginLeft: '200px' }} label="选择二维码文件">
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
              <Select style={{ width: 50 }}>
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
          dataSource={addLaQun.addLaQunList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: addLaQun.total,
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

export default AddWxMgr;
