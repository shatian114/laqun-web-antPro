import React, { PureComponent } from 'react';
import { Card, Button, } from 'antd';


class AddFriend extends PureComponent {

  releaseJob = () => {
    this.props.releaseJob('');
  }

  render() {
    
    return (
      <Card>
        
        <Button onClick={this.releaseJob} type="primary">
          发布任务
        </Button>

      </Card>
    );
  }
}

export default AddFriend;
