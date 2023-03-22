import React from 'react';
import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: <Space><FontAwesomeIcon icon={faCircle}/><p>{i.toString(36) + i}</p> </Space>,
  });
}

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const AddUsers: React.FC = () => (
  <Select
    mode="tags"
    style={{ width: '100vh' }}
    placeholder="Tags Mode"
    onChange={handleChange}
    options={options}
  />
);

export default AddUsers;