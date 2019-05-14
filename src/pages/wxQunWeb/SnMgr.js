import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Modal, Popconfirm, Upload } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({ sn, loading }) => ({
  sn,
  searching: loading.effects['sn/searchSn'],
  editRemarking: loading.effects['sn/setRemark'],
  deleteing: loading.effects['sn/delete'],
  adding: loading.effects['sn/add'],
}))
@Form.create()
class SnMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'sn/searchSn',
          payload: {
            ...values,
            'page': page,
            'pageSize': pageSize,
          },
        });
      }
    });
  };

  setRemark = () => {
    const { sn, form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'sn/setRemark',
          payload: {
            ...values,
            sn: sn.editRecord.sn,
            callback: this.search,
          },
        });
      }
    });
  };

  visibleEditRemark = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sn/save',
      payload: {
        editRecord: record,
        visibleEditRemark: true,
      },
    });
  };

  hiddenEditRemark = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sn/save',
      payload: {
        visibleEditRemark: false,
      },
    });
  };

  delete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sn/delete',
      payload: {
        sn: record.sn,
        callback: this.search,
      },
    });
  };

  selectFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sn/save',
      payload: {
        snFile: file.fileList[0].originFileObj,
      },
    });
  };

  add = () => {
    const { dispatch, sn } = this.props;
    dispatch({
      type: 'sn/add',
      payload: {
        file: sn.snFile,
        callback: this.search,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      sn,
      editRemarking,
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
        title: 'SN',
        dataIndex: 'sn',
        key: 1,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 2,
        editable: true,
      },
      {
        title: '异常微信数量',
        dataIndex: 'badWxNum',
        key: 3,
      },
      {
        title: '正常微信数量',
        dataIndex: 'goodWxNum',
        key: 4,
      },
      {
        title: '当前状态',
        dataIndex: 'currentState',
        key: 5,
      },
      {
        title: '任务',
        dataIndex: 'jobName',
        key: 6,
      },
      {
        title: '任务参数',
        dataIndex: 'jobContent',
        key: 7,
      },
      {
        title: '停止原因',
        dataIndex: 'stopContent',
        key: 8,
        render: (text, record) => <span>{record.jobName === '任务已停止' ? text : ''}</span>,
      },
      {
        title: '最后通信时间',
        dataIndex: 'lastHttpTime',
        key: 9,
        render: (text, record) => {
          const color = record.lastHttpTime.length === 19 && Date.parse(record.lastHttpTime)+(10*60*1000) < Date.parse(new Date()) ? 'red' : '';
          return (
            <span style={{'color': color}}>{text}</span>
          )
        }
      },
      {
        title: '手机APP版本',
        dataIndex: 'appVer',
        key: 10,
      },
      {
        title: '操作',
        key: 11,
        render: (text, record) => (
          <Button.Group size="small">
            <Button
              icon="edit"
              onClick={() => {
                this.visibleEditRemark(record);
              }}
            >
              设置备注
            </Button>
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

            <Button icon="stop">停止任务</Button>
          </Button.Group>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="查询sn">
            {getFieldDecorator('sn', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的sn" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="添加sn">
            <Upload
              beforeUpload={() => {
                return false;
              }}
              onChange={this.selectFile}
            >
              <Button>选择sn文件</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.add} loading={adding}>
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={sn.snList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: sn.total,
            showSizeChanger: true,
            onShowSizeChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
          }}
        />

        <Modal
          width="60%"
          title="请输入备注"
          visible={sn.visibleEditRemark}
          onOk={this.setRemark}
          onCancel={this.hiddenEditRemark}
          confirmLoading={editRemarking}
        >
          <Form>
            <FormItem>
              {getFieldDecorator('remark', {
                initialValue: sn.editRecord.remark,
              })(<TextArea placeholder="请输入备注" />)}
            </FormItem>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default SnMgr;
