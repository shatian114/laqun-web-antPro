import React, { PureComponent } from 'react';
import { Form, Card, Button, Select, Modal, Checkbox, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import AddFriend from '@/components/Job/AddFriend';
import LoginWx from '@/components/Job/LoginWx';
import ChangeData from '@/components/Job/ChangeData';
import Train from '@/components/Job/Train';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ sn, snGroup, loading }) => ({
  sn,
  snGroup,
  customerSearching: loading.effects['customer/search'],
  searching: loading.effects['addWx/search'],
  deleteing: loading.effects['addWx/delete'],
  adding: loading.effects['addWx/add'],
}))
@Form.create()
class JobMgr extends PureComponent {

  state = {
    visibleSelectSn: false,
    selectSnArr: [],
    job: '登录微信',
  }
  
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'snGroup/search',
      payload: {
        groupName: '',
        page: 1,
        pageSize: 10000,
      },
    });
    dispatch({
      type: 'sn/searchSn',
      payload: {
        sn: '',
        page: 1,
        pageSize: 10000,
      },
    });
  };

  allSelect = e => {
    const { sn } = this.props;
    this.setState({
      selectSnArr: e.target.checked ? sn.snList.map(v => v.sn) : [],
    });
  };

  changeSnGroup = (groupMember) => {
    this.setState({
      selectSnArr: groupMember
    });
  };

  releaseJob = (jobContent) => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        console.log('start release job', values);
        dispatch({
          type: 'job/release',
          payload: {
            snArr: values.selectSnArr.join(','),
            job: this.state.job,
            'jobContent': jobContent,
          }
        });
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      customerSearching,
      sn,
      snGroup,
    } = this.props;
    
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="选择任务类型">
            {getFieldDecorator('job', {
              initialValue: '登录微信',
            })(
              <Select style={{ width: 140 }} onChange={(job) => {this.setState({'job': job, jobContent: ''})}} loading={customerSearching}>
                <Option value='登录微信'>登录微信</Option>
                <Option value='添加好友'>添加好友</Option>
                <Option value='修改资料'>修改资料</Option>
                <Option value='养号'>养号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={() => {this.setState({visibleSelectSn: true})}} type="primary">
              选择接受任务的手机
            </Button>
          </FormItem>
        </Form>

        {
          this.state.job === '登录微信' ?
            (
              <LoginWx releaseJob={this.releaseJob} />
            ) : ''
        }

        {
          this.state.job === '添加好友' ?
            (
              <AddFriend releaseJob={this.releaseJob} />
            ) : ''
        }

        {
          this.state.job === '修改资料' ?
            (
              <ChangeData releaseJob={this.releaseJob} />
            ) : ''
        }

        {
          this.state.job === '养号' ?
            (
              <Train releaseJob={this.releaseJob} />
            ) : ''
        }

        <Modal
          width="60%"
          title='选择接受任务的手机'
          visible={this.state.visibleSelectSn}
          onOk={() => {this.setState({visibleSelectSn: false})}}
          onCancel={() => {this.setState({visibleSelectSn: false})}}
        >
          <Form layout="inline">
            <FormItem label="选择SN组">
              {getFieldDecorator('snGroupName', {
                initialValue: '',
              })(
                <Select style={{ width: 140 }} onChange={this.changeSnGroup} loading={customerSearching}>
                  {
                    snGroup.snGroupList.map(v => (
                      <Option value={v.groupMember} key={v.groupName}>{v.groupName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <Divider />
            <Checkbox onChange={this.allSelect}>全选/取消全选</Checkbox>
            <Divider />
            <FormItem>
              {getFieldDecorator('selectSnArr', {
                initialValue: this.state.selectSnArr,
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

export default JobMgr;
