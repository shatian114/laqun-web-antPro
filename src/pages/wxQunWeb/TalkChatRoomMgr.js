import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Popconfirm, Upload } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ talkChatRoom, loading }) => ({
  talkChatRoom,
  searching: loading.effects['talkChatRoom/search'],
  deleteing: loading.effects['talkChatRoom/delete'],
  adding: loading.effects['talkChatRoom/add'],
}))
@Form.create()
class TalkChatRoomMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'talkChatRoom/search',
          payload: {
            qunQr: values.searchQunQr,
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
      type: 'talkChatRoom/delete',
      payload: {
        qunQr: record.qunQr,
        callback: this.search,
      },
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'talkChatRoom/save',
      payload: {
        talkChatRoomFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, talkChatRoom } = this.props;
    dispatch({
      type: 'talkChatRoom/add',
      payload: {
        file: talkChatRoom.talkChatRoomFile,
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
      talkChatRoom,
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
        editable: true,
      },
      {
        title: '成员数量',
        dataIndex: 'friendNum',
        key: 3,
      },
      {
        title: '群名称',
        dataIndex: 'nick',
        key: 4,
      },
      {
        title: '添加时间',
        dataIndex: 'addTime',
        key: 5,
      },
      {
        title: '操作',
        key: 6,
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
          <FormItem label="查询群聊">
            {getFieldDecorator('searchQunQr', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的群聊二维码链接" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="添加群聊">
            <Upload
              beforeUpload={() => {
                return false;
              }}
              onChange={this.selectFile}
            >
              <Button>选择群聊文件</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={talkChatRoom.talkChatRoomList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: talkChatRoom.total,
          }}
        />
      </Card>
    );
  }
}

export default TalkChatRoomMgr;
