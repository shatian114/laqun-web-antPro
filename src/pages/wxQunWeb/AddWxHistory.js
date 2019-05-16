import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ addWxHistory, loading }) => ({
  addWxHistory,
  searching: loading.effects['addWxHistory/search'],
  deleteing: loading.effects['addWxHistory/delete'],
}))
@Form.create()
class AddWxHistory extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'addWxHistory/search',
          payload: {
            ...values,
            'page': page,
            'pageSize': pageSize,
          },
        });
      }
    });
  };

  test = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imgResources/test',
      payload: {
        sn: '9oiujnmh',
        wxidlist: 'wxid1,wxid2,wxid3'
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      addWxHistory,
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
        title: '被添加次数',
        dataIndex: 'gaddNum',
        key: 2,
      },
      {
        title: '被添加最后时间',
        dataIndex: 'goAddTime',
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
          <FormItem>
            <Button onClick={this.test} icon="search" type="primary" loading={searching}>
              测试
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={addWxHistory.infoList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: addWxHistory.total,
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

export default AddWxHistory;
