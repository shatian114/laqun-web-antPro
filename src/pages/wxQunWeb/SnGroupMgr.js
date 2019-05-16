import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Table, Modal, Popconfirm, Col, Checkbox, Divider } from 'antd';
import { connect } from 'dva';
import { Row } from 'antd/es/grid';

const FormItem = Form.Item;

@connect(({ sn, snGroup, loading }) => ({
  sn,
  snGroup,
  searching: loading.effects['snGroup/search'],
  deleteing: loading.effects['snGroup/delete'],
  adding: loading.effects['snGroup/add'],
  operating: loading.effects['snGroup/operate'],
}))
@Form.create()
class SnGroupMgr extends PureComponent {
  state = {
    groupMember: [],
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sn/searchSn',
      payload: {
        sn: '',
        page: 1,
        pageSize: 100000,
      },
    });
  };

  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'snGroup/search',
          payload: {
            groupName: values.searchGroupName,
            'page': page,
            'pageSize': pageSize,
          },
        });
      }
    });
  };

  visibleOperate = (e, operateType, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'snGroup/save',
      payload: {
        'operateType': operateType,
        visibleOperate: true,
        groupName: operateType === 'change' ? record.groupName : '',
        groupMember: operateType === 'change' ? record.groupMember.split(',') : [],
      },
    });
    this.setState({
      groupMember: operateType === 'change' ? record.groupMember.split(',') : [],
    });
  };

  hiddenOperate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'snGroup/save',
      payload: {
        visibleOperate: false,
      },
    });
  };

  delete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'snGroup/delete',
      payload: {
        groupName: record.groupName,
        callback: this.search,
      },
    });
  };

  allSelect = e => {
    const { sn } = this.props;
    this.setState({
      groupMember: e.target.checked ? sn.snList.map(v => v.sn) : [],
    });
  };

  operateSnGroup = () => {
    const { dispatch, form, snGroup } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'snGroup/add',
          payload: {
            operateType: snGroup.operateType,
            snGroupName: values.groupName,
            snArr: values.groupMember.join(','),
            callback: this.search,
          },
        });
      }
    });
  };

  changeSelectSnGroup = snArr => {
    const { dispatch } = this.props;
    dispatch({
      type: 'snGroup/save',
      payload: {
        groupMember: snArr,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      adding,
      deleteing,
      operating,
      snGroup,
      sn,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: 'SN组',
        dataIndex: 'groupName',
        key: 1,
      },
      {
        title: '操作',
        key: 2,
        render: (text, record) => (
          <Button.Group size="small">
            <Button
              icon="edit"
              onClick={() => {
                this.visibleOperate(1, 'change', record);
              }}
            >
              修改
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
          </Button.Group>
        ),
      },
    ];
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="查询sn组">
            {getFieldDecorator('searchGroupName', {
              initialValue: '',
            })(<Input placeholder="请输入要查询的sn组名称" />)}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button
              icon="file-add"
              type="primary"
              onClick={() => {
                this.visibleOperate(this, 'add');
              }}
              loading={adding}
            >
              添加
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={snGroup.snGroupList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: snGroup.total,
            showSizeChanger: true,
            onShowSizeChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
          }}
        />

        <Modal
          width="60%"
          title={snGroup.operateType === 'add' ? '添加SN组' : '修改SN组'}
          visible={snGroup.visibleOperate}
          onOk={this.operateSnGroup}
          onCancel={this.hiddenOperate}
          confirmLoading={operating}
        >
          <Form>
            <FormItem
              label="SN组名称"
              labelCol={{ xs: { span: 24 }, sm: { span: 3 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
            >
              {getFieldDecorator('groupName', {
                initialValue: snGroup.groupName,
              })(<Input placeholder="请输入SN组名称" />)}
            </FormItem>
            <Divider />
            <Checkbox onChange={this.allSelect}>全选/取消全选</Checkbox>
            <Divider />
            <FormItem>
              {getFieldDecorator('groupMember', {
                initialValue: this.state.groupMember,
              })(
                <Checkbox.Group options={sn.snList.map(v => {return v.sn})} onChange={this.changeSelectSnGroup} />
              )}
            </FormItem>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default SnGroupMgr;
