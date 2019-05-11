import React, { Component } from 'react';
import PageLoading from '@/components/PageLoading';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class TsRoleTreeIndex extends Component {
  state = {};

  render() {
    return <TreeSelect />;
  }
}

export default TsRoleTreeIndex;
