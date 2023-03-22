import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log(e);
};

const Description: React.FC = () => (
  <>
    <TextArea placeholder="Description" allowClear onChange={onChange} />
  </>
);

export default Description;