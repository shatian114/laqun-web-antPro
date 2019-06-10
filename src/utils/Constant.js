export const formItemLayout = {
	labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
    md: { span: 17 },
  },
};

export const formItemGrid = {
	span: 8
};

export function geneImportColumn(column){
  let column2 = column;
  column2.shift();
  return column2;
}

export const webConfig = {
  Bucket: '-1258004048',
  Region: 'ap-guangzhou',
  tpUriPre: '-1258004048.cos.ap-guangzhou.myqcloud.com/',
}