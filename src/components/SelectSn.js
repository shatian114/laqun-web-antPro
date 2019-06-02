import React, { PureComponent } from 'react';
import { Form, Card, Button, Select, Divider, Checkbox } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ sn, snGroup, loading }) => ({
  sn,
  snGroup,
}))
@Form.create()
class SelectSn extends PureComponent {

  state = {
    indeterminate: false,
    isSelectAll: false,
  }

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
    dispatch({
      type: 'snGroup/search',
      payload: {
        groupName: '',
        page: 1,
        pageSize: 100000,
      },
    });
  }

  selectSn = () => {
    // this.props.selectSn(this.props.form.getFieldValue('selectSnArr'))
  }

  changeSnGroup = (groupMember) => {
    const { form } = this.props;
    form.setFieldsValue({
      selectSnArr: groupMember,
    });
  };

  changeSelectSnGroup = (snArr) => {
    const { sn } = this.props;
    this.setState({
      indeterminate: snArr.length > 0 && snArr.length < sn.snList.length,
      isSelectAll: snArr.length === sn.snList.length,
    });
    this.props.selectSn(snArr);
  }

  allSelect = e => {
    const { sn, form } = this.props;
    form.setFieldsValue({
      selectSnArr: e.target.checked ? sn.snList.map(v => v.sn) : [],
    });
    this.setState({
      isSelectAll: e.target.checked
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      snGroup,
      snGroupSearching,
      sn
    } = this.props;
    
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="选择SN组">
            {getFieldDecorator('snGroupName', {
              initialValue: '',
            })(
              <Select style={{ width: 140 }} onChange={this.changeSnGroup} loading={snGroupSearching}>
                {
                  snGroup.snGroupList.map(v => (
                    <Option value={v.groupMember} key={v.groupName}>{v.groupName}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <Divider />
          <Checkbox onChange={this.allSelect} indeterminate={this.state.indeterminate} checked={this.state.isSelectAll}>全选/取消全选</Checkbox>
          <Divider />
          <FormItem>
            {getFieldDecorator('selectSnArr', {
              initialValue: [],
            })(
              <Checkbox.Group options={sn.snList.map(v => {return v.sn})} onChange={this.changeSelectSnGroup} />
            )}
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default SelectSn;