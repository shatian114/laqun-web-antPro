import React, { PureComponent } from 'react';
import { Form, Card, Button, Table, Popconfirm, Upload, Select } from 'antd';
import { connect } from 'dva';
import { webConfig } from '@/utils/Constant';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ imgResources, loading }) => ({
  imgResources,
  searching: loading.effects['imgResources/search'],
  deleteing: loading.effects['imgResources/delete'],
  adding: loading.effects['imgResources/add'],
}))
@Form.create()
class ImgResourcesMgr extends PureComponent {
  search = (e, page = 1, pageSize = 10) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'imgResources/search',
          payload: {
            resourceType: values.resourcesType,
            page: page,
            pageSize: pageSize,
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
          type: 'imgResources/delete',
          payload: {
            fileName: record.val,
            resourceType: values.resourcesType,
            callback: this.search,
          },
        });
      }
    });
  };

  selectFile = (file) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imgResources/save',
      payload: {
        imgResourcesFileArr: file.fileList,
      },
    });
  };

  add = () => {
    const { dispatch, imgResources, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'imgResources/add',
          payload: {
            resourceType: values.resourcesType,
            file: imgResources.imgResourcesFileArr,
            callback: this.search,
          },
        });
      }
    });
  };

  changeType = resourceType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imgResources/save',
      payload: {
        resourceType: resourceType,
      },
    });
  };

  test = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imgResources/test',
      payload: {
        sn: 'b5794f4f',
        jobName: '测试',
        jobContent: '测试内容',
        wxid: '6',
        resourcesType: 'avatar',
        resourcesNum: 2,
      },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      searching,
      deleteing,
      adding,
      imgResources,
    } = this.props;
    const columns = [
      {
        title: '序号',
        key: 0,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '图片',
        dataIndex: 'val',
        key: 1,
        render: text => (
          <img
            src={`http://${imgResources.resourceType.toLowerCase()}${webConfig.tpUriPre}${text}?${Date.parse(new Date())}`}
            width={80}
            height={80}
            alt='无法加载'
          />
        ),
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
              initialValue: 'avatar',
            })(
              <Select style={{ width: 140 }} onChange={this.changeType}>
                <Option value="avatar">头像</Option>
                <Option value="backImg">朋友圈背景</Option>
                <Option value="momentsImg">发圈图片</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={this.search} icon="search" type="primary" loading={searching}>
              查询
            </Button>
          </FormItem>
          <FormItem style={{ marginLeft: '200px' }} label="添加图片资源">
            <Upload
              multiple
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
          <FormItem>
            <Button icon="file-add" type="primary" onClick={this.test}>
              测试获取图片
            </Button>
          </FormItem>
        </Form>

        <Table
          dataSource={imgResources.imgResourcesList}
          loading={searching}
          columns={columns}
          pagination={{
            onChange: (page, pageSize) => {
              this.search(this, page, pageSize);
            },
            total: imgResources.total,
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

export default ImgResourcesMgr;
