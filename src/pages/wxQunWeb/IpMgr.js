import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Popconfirm } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ ip, loading }) => ({
  ip,
  searching: loading.effects['sn/search'],
  deleteing: loading.effects['sn/delete'],
}))
@Form.create()
class IpMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'ip/search',
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
      type: 'ip/delete',
      payload: {
        ipAddr: record.ipAddr,
        callback: this.search,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      deleteing,
      ip,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: 'IP',
        dataIndex: 'ipAddr',
        key: 1,
      },
      {
        title: '使用次数',
        dataIndex: 'useNum',
        key: 2,
      },
      {
        title: '最后使用时间',
        dataIndex: 'lastUseTime',
        key: 3,
      },
      {
        title: '操作',
        key: 4,
        render: (text, record) => (
          <Button.Group size="small">
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => {
                this.delete(record);
              }}
            >
              <Button icon="delete" loading={deleteing}>
                删除
              </Button>
            </Popconfirm>
          </Button.Group>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="查询IP">
            {getFieldDecorator('searchIp', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的IP" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={ip.ipList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: ip.total,
          }}
        />
      </Card>
    );
  }
}

export default IpMgr;
