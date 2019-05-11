import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Popconfirm, Upload } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ news, loading }) => ({
  news,
  searching: loading.effects['news/search'],
  deleteing: loading.effects['news/delete'],
  adding: loading.effects['news/add'],
}))
@Form.create()
class NewsMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'news/search',
          payload: {
            newsName: values.searchNewsName,
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
      type: 'news/delete',
      payload: {
        newsName: record.newsName,
        callback: this.search,
      },
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'news/save',
      payload: {
        newsFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, news } = this.props;
    dispatch({
      type: 'news/add',
      payload: {
        file: news.newsFile,
        callback: this.search,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      deleteing,
      adding,
      news,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '新闻名称',
        dataIndex: 'newsName',
        key: 1,
      },
      {
        title: '新闻URL',
        dataIndex: 'newsUrl',
        key: 2,
        editable: true,
      },
      {
        title: '添加时间',
        dataIndex: 'addTime',
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
          <FormItem label="查询新闻">
            {getFieldDecorator('searchNewsName', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的新闻名称" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="添加新闻">
            <Upload
              beforeUpload={() => {
                return false;
              }}
              onChange={this.selectFile}
            >
              <Button>选择新闻文件</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={news.newsList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: news.total,
          }}
        />
      </Card>
    );
  }
}

export default NewsMgr;
