import React from 'react';
import { Table, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width : '40vw'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width : '30vw'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width : '30vw'
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }
];

const Tables: React.FC = () => (
  <>
    <Table showHeader={false} columns={columns} dataSource={data} pagination={false} />
  </>
);

export default Tables;