/*
 * @Descripttion: 
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 15:47:03
 */
import  { useEffect, useState } from "react";
import { Form, Input, Button, Collapse, message,Table, Layout,Menu } from 'antd'
import { AppstoreOutlined, RollbackOutlined } from '@ant-design/icons';
import EditableCell from './EditableCell';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '1',
    icon: <AppstoreOutlined />,
    label: '通用政策与SOP',
    children: [
      { key: '11', label: '防止贿赂及贪污' },
      { key: '12', label: '个人信息管理' },
      { key: '13', label: '信息安全' },
      { key: '14', label: '举报' },
    ],
  },
  {
    key: '2',
    icon: <AppstoreOutlined />,
    label: '部门政策与SOP',
    children: [
      {
        key: '21',
        label: 'IT',
        children: [
          { key: '211', label: '质量体系相关' },
          { key: '212', label: '非质量体系相关' },
        ],
      },
      {
        key: '22',
        label: '内控',
        children: [
          { key: '221', label: '质量体系相关' },
          { key: '222', label: '非质量体系相关' },
        ],
      },
      { key: '23', label: '行政' },
      { key: '24', label: '财务' },
      { key: '25', label: '法务' },
      { key: '26', label: '采购' },
    ],
  },
];

const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
};


const DetailPage = () => {
  const location = useLocation();
  const { record } = location.state;
  const intl = useIntl();

  const [form ] = Form.useForm();
  const [trainForm ] = Form.useForm();
  const [editing, setEditing] = useState(false); //基本信息、制度内容
  const [trainEdit, setTrainEdit] = useState(false);//培训信息
  const [tableData, setTableData]=useState([]);//培训完成情况data

  useEffect(() => {
    fetch(`http://localhost:3000/api/query/train-info/${record.key}`)
      .then(response => response.json())
      .then(data => {
        trainForm.setFieldsValue({
          ...data
        })
        setTableData(data.content)
      })
      .catch(error => console.error('发生错误：', error));
  }, [])

  /**
   * 基本信息、制度内容-保存
   * @return {*}
   */
  const onFinish = () => {
    const values = form.getFieldsValue();
    form
      .validateFields()
      .then(() => {
        fetch(`http://localhost:3000/api/basic-detail/save/${record.key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
          .then(response => response.json())
          .then(() => {
            message.success('保存成功！');
          })
          .catch(error => {
            message.warning(`保存失败！${error}`);
          });

        setEditing(false);
      })
      .catch((error) => {
        message.warning(intl.formatMessage({ id: 'header.help', defaultMessage: '校验失败，请检查表单输入' }));
        console.log('Validation error:', error);
      });
  };

  /**
   * 培训信息-保存
   * @return {*}
   */  
  const trainInfoSave=()=>{
    const values = trainForm.getFieldsValue();
    const obj={
      ...values,
      content: tableData
    }
    trainForm
      .validateFields()
      .then(() => {
        fetch(`http://localhost:3000/api/train-detail/save/${record.key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        })
          .then(response => response.json())
          .then(() => {
            message.success('保存成功！');
          })
          .catch(error => {
            message.warning(`保存失败！${error}`);
          });

        setTrainEdit(false);
      })
      .catch((error) => {
        message.warning('校验失败，请检查表单输入');
        console.log('Validation error:', error);
      });
  }

  /**
   * 更新表格数据
   * @param {*} row
   * @return {*}
   */  
  const handleTableData=(row)=>{
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index > -1) {
      newData.splice(index, 1, row);
      setTableData(newData);
    }
  }

  const columns = [
    {
      title: '完成%',
      dataIndex: 'percent',
      render: (_, row) => (
        <EditableCell
        dataIndex='percent'
        record={row}
        rules={[{required:true, message: '请输入完成%'}]}
        onSave={(value) => handleTableData({ ...row, percent: value })}
          editing={trainEdit}
        />
      ),
    },
    {
      title: '完成情况记录日期',
      dataIndex: 'finishDate',
      render: (_, row) => (
        <EditableCell
        dataIndex='finishDate'
        record={row}
        rules={[{required:true, message: '请输入完成情况记录日期'}]}
        onSave={(value) => handleTableData({ ...row, finishDate: value })}
          editing={trainEdit}
        />
      ),      
    },
    {
      title: '预计完成日期',
      dataIndex: 'predictDate',
      render: (_, row) => (
        <EditableCell
        dataIndex='predictDate'
        record={row}
        rules={[{required:true, message: '请输入预计完成日期'}]}
        onSave={(value) => handleTableData({ ...row, predictDate: value })}
          editing={trainEdit}
        />
      ),      
    },
  ];

  const items = [
    {
      key: '1',
      collapsible: 'icon',
      label: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormattedMessage id="header.help" defaultMessage="基本信息" />
        {editing ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => setEditing(false)}>
              取消
            </Button>
            <Button type="primary" onClick={onFinish}>
              保存
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => setEditing(true)}>
            编辑
          </Button>
        )}
      </div>,
      children: <Form
        initialValues={record}
        name="basic"
        form={form}
        labelAlign='left'
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<FormattedMessage id="header.help" defaultMessage="名称" />}
          name="fileName"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="header.help" defaultMessage="请输入名称" />,
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="其他代替名称"
          name="elseName"
          rules={[
            {
              required: true,
              message: '请输入其他代替名称',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[
            {
              required: true,
              message: '请输入描述',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="发布部门"
          name="department"
          rules={[
            {
              required: true,
              message: '请输入发布部门',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="文件编号"
          name="fileNo"
          rules={[
            {
              required: true,
              message: '请输入文件编号',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="文件类型"
          name="type"
          rules={[
            {
              required: true,
              message: '请输入文件类型',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="语言"
          name="language"
          rules={[
            {
              required: true,
              message: '请输入语言',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="版本号"
          name="version"
          rules={[
            {
              required: true,
              message: '请输入版本号',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="修订时间"
          name="date"
          rules={[
            {
              required: true,
              message: '请输入修订时间',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="来源"
          name="source"
          rules={[
            {
              required: true,
              message: '请输入来源',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label="常用"
          name="use"
          rules={[
            {
              required: true,
              message: '请输入常用',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
      </Form>,
    },
    {
      key: '2',
      label: '制度内容如下',
      children: <Form
        initialValues={record}
        name="fileUrl"
        form={form}
        labelAlign='left'
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label=""
          name="fileUrl"
          rules={[
            {
              required: true,
              message: '请输入文件链接',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
      </Form>,
      showArrow: false,
      collapsible: "icon"
    },
    {
      key: '3',
      collapsible: 'icon',
      label: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        培训信息
        {trainEdit ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => setTrainEdit(false)}>
              取消
            </Button>
            <Button type="primary" onClick={trainInfoSave}>
              保存
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => setTrainEdit(true)}>
            编辑
          </Button>
        )}
      </div>,
      children:
       <Form
        name="trainInfo"
        form={trainForm}
        labelAlign='left'
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        autoComplete="off"
      >
        <Form.Item
          label="培训课程名称"
          name="trainName"
          rules={[
            {
              required: true,
              message: '请输入培训课程名称',
            },
          ]}
        >
          <Input disabled={!trainEdit} />
        </Form.Item>
        <Form.Item
          label="培训链接"
          name="trainUrl"
          rules={[
            {
              required: true,
              message: '请输入培训链接',
            },
          ]}
        >
          <Input disabled={!trainEdit} />
        </Form.Item>
        <Table
      bordered
      dataSource={tableData}
      columns={columns
      }
      rowClassName="editable-row"
    />
      </Form>
    },
  ];

  return <>
  <Layout style={layoutStyle}>
      <Sider width="25%" style={siderStyle}>
        <Menu
          mode="inline"
          defaultOpenKeys={['1', '2']}
          items={menuItems}
        />
      </Sider>
      <Content >
      <Button style={{ display: 'flex', margin: '5px 5px 20px 0px' }} icon={<RollbackOutlined />}
      onClick={()=>{history.go(-1)}}>返回</Button>
    <Collapse items={items} defaultActiveKey={['1', '2', '3']} />
      </Content>
      
    </Layout>
</>
}

export default DetailPage