/*
 * @Descripttion: 详情页面
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 15:47:03
 */
import  { useEffect, useState } from "react";
import { Form, Input, Button, Collapse, message,Table, Layout,Menu } from 'antd'
import { AppstoreOutlined, RollbackOutlined } from '@ant-design/icons';
import EditableCell from './EditableCell';
import { useLocation } from 'react-router-dom';
import { FormattedMessage,useIntl } from 'react-intl';
import {menuItems} from './HomePage';

const { Header, Sider, Content } = Layout;


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
      title: intl.formatMessage({ id: 'detail.title.percent', defaultMessage: '完成%' }),
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
      title: intl.formatMessage({ id: 'detail.title.finishDate', defaultMessage: '完成情况记录日期' }),
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
      title: intl.formatMessage({ id: 'detail.title.predictDate', defaultMessage: '预计完成日期' }),
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
        {intl.formatMessage({ id: 'detail.title.basic', defaultMessage: '基本信息' })}
        {editing ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => setEditing(false)}>
            {intl.formatMessage({ id: 'common.btn.cancel', defaultMessage: '取消' })}
            </Button>
            <Button type="primary" onClick={onFinish}>
            {intl.formatMessage({ id: 'common.btn.save', defaultMessage: '保存' })}
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => setEditing(true)}>
            {intl.formatMessage({ id: 'common.btn.edit', defaultMessage: '编辑' })}
          </Button>
        )}
      </div>,
      children: <Form
        initialValues={record}
        name="basic"
        form={form}
        labelAlign='left'
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.name', defaultMessage: '名称' })}
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
          label={intl.formatMessage({ id: 'list.title.description', defaultMessage: '描述' })}
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
          label={intl.formatMessage({ id: 'list.title.department', defaultMessage: '发布部门' })}
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
          label={intl.formatMessage({ id: 'detail.title.contact', defaultMessage: '联系人' })}
          name="contact"
          rules={[
            {
              required: true,
              message: '请输入联系人',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.range', defaultMessage: '适用范围' })}
          name="range"
          rules={[
            {
              required: true,
              message: '请输入适用范围',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.fileNo', defaultMessage: '文件编号' })}
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
          label={intl.formatMessage({ id: 'list.title.type', defaultMessage: '文件类型' })}
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
          label={intl.formatMessage({ id: 'list.title.language', defaultMessage: '语言' })}
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
          label={intl.formatMessage({ id: 'list.title.version', defaultMessage: '版本号' })}
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
          label={intl.formatMessage({ id: 'detail.title.changeTime', defaultMessage: '修订时间' })}
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
          label={intl.formatMessage({ id: 'detail.title.content', defaultMessage: '修订内容' })}
          name="content"
          rules={[
            {
              required: true,
              message: '请输入常用',
            },
          ]}
        >
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.source', defaultMessage: '来源' })}
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
          label={intl.formatMessage({ id: 'detail.title.file', defaultMessage: '文档' })}
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
    },
    {
      key: '3',
      collapsible: 'icon',
      label: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {intl.formatMessage({ id: 'detail.title.train', defaultMessage: '培训信息' })}
        {trainEdit ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => setTrainEdit(false)}>
            {intl.formatMessage({ id: 'common.btn.cancel', defaultMessage: '取消' })}
            </Button>
            <Button type="primary" onClick={trainInfoSave}>
            {intl.formatMessage({ id: 'common.btn.save', defaultMessage: '保存' })}
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => setTrainEdit(true)}>
            {intl.formatMessage({ id: 'common.btn.edit', defaultMessage: '编辑' })}
          </Button>
        )}
      </div>,
      children:
       <Form
        name="trainInfo"
        form={trainForm}
        labelAlign='left'
        labelCol={{
          span: 7
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
          label={intl.formatMessage({ id: 'detail.title.platform', defaultMessage: '培训平台' })}
          name="platform"
          rules={[
            {
              required: true,
              message: '请输入培训平台',
            },
          ]}
        >
          <Input disabled={!trainEdit} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.class', defaultMessage: '培训课程名称' })}
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
      onClick={()=>{history.go(-1)}}>{intl.formatMessage({ id: 'common.btn.back', defaultMessage: '返回' })}</Button>
    <Collapse items={items} defaultActiveKey={['1', '2', '3']} />
      </Content>
      
    </Layout>
</>
}

export default DetailPage