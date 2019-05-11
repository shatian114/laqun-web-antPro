import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Popconfirm } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ customer, loading }) => ({
  customer,
  searching: loading.effects['customer/search'],
  adding: loading.effects['customer/addCustomer'],
}))
@Form.create()
class CustomerMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'customer/search',
          payload: {
            customerName: values.searchName,
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
      type: 'customer/delete',
      payload: {
        customerName: record.name,
        customerId: record.id,
        callback: this.search,
      },
    });
  };

  add = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'customer/addCustomer',
          payload: {
            customerName: values.addName,
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
      customer,
      deleteing,
      adding,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 1,
      },
      {
        title: '添加好友数量',
        dataIndex: 'addNum',
        key: 2,
        editable: true,
      },
      {
        title: '已经成为好友数量',
        dataIndex: 'friendNum',
        key: 3,
      },
      {
        title: '被拉群数量',
        dataIndex: 'laNum',
        key: 4,
      },
      {
        title: '剩余添加好友数量',
        dataIndex: 'oddNum',
        key: 5,
      },
      {
        title: '操作',
        key: 11,
        render: (text, record) => (
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => {
              this.delete(record);
            }}
          >
            <Button size="small" icon="delete" loading={deleteing}>
              删除
            </Button>
          </Popconfirm>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="查询客户">
            {getFieldDecorator('searchName', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的客户名称" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="添加客户">
            {getFieldDecorator('addName', {
              initialValue: '',
            })(<Input placeholder="请输入要添加的客户名称" />)}
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={customer.customerList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: customer.total,
          }}
        />
      </Card>
    );
  }
}

export default CustomerMgr;
