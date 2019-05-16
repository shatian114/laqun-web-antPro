import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ laQunHistory, loading }) => ({
  laQunHistory,
  searching: loading.effects['laQunHistory/search'],
}))
@Form.create()
class LaQunHistory extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'laQunHistory/search',
          payload: {
            ...values,
            'page': page,
            'pageSize': pageSize,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      laQunHistory,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: 'wxid',
        dataIndex: 'wxid',
        key: 1,
      },
      {
        title: '被拉次数',
        dataIndex: 'laNum',
        key: 2,
      },
      {
        title: '被拉最后时间',
        dataIndex: 'laTime',
        key: 3,
      },
      {
        title: '添加时间',
        dataIndex: 'addTime',
        key: 4,
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="查询wxid">
            {getFieldDecorator('wxid', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的wxid" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={laQunHistory.snList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: laQunHistory.total,
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

export default LaQunHistory;
