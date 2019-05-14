import React, { PureComponent } from 'react';
import { Form, Card, Button, Table, Popconfirm, Upload, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ textResources, loading }) => ({
  textResources,
  searching: loading.effects['textResources/search'],
  deleteing: loading.effects['textResources/delete'],
  adding: loading.effects['textResources/add'],
}))
@Form.create()
class TextResourcesMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'textResources/search',
          payload: {
            resourcesType: values.resourcesType,
            'page': page,
            'pageSize': pageSize,
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
          type: 'textResources/delete',
          payload: {
            val: record.val,
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
      type: 'textResources/save',
      payload: {
        textResourcesFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, textResources, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'textResources/add',
          payload: {
            resourceType: values.resourcesType,
            file: textResources.textResourcesFile,
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
      deleteing,
      adding,
      textResources,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '值',
        dataIndex: 'val',
        key: 1,
      },
      {
        title: '添加时间',
        dataIndex: 'addTime',
        key: 2,
      },
      {
        title: '操作',
        key: 3,
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
          <FormItem label="选择要操作的资源类型">
            {getFieldDecorator('resourcesType', {
              initialValue: 'nick',
            })(
              <Select style={{ width: 140 }}>
                <Option value="nick">昵称</Option>
                <Option value="comment">朋友圈评论</Option>
                <Option value="moments">发圈内容</Option>
                <Option value="sign">签名</Option>
                <Option value="addFriendVerify">加好友验证</Option>
                <Option value="talkContent">聊天内容</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="添加文本资源">
            <Upload
              beforeUpload={() => {
                return false;
              }}
              onChange={this.selectFile}
            >
              <Button>选择资源文件</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={textResources.textResourcesList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: textResources.total,
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

export default TextResourcesMgr;
