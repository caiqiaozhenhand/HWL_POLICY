/*
 * @Descripttion: 详情页面
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 15:47:03
 */
import { useEffect, useState } from "react";
import { Form, Input, Button, Collapse, message, Table, Layout, Menu } from 'antd'
import { RollbackOutlined } from '@ant-design/icons';
import EditableCell from './EditableCell';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { menuItems } from './HomePage';

const { Sider, Content } = Layout;

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


const DetailPage = (props) => {
  const location = useLocation();
  const { record } = location.state;
  const intl = useIntl();

  const [form] = Form.useForm();
  const [trainForm] = Form.useForm();
  const [editing, setEditing] = useState(false); //基本信息、制度内容是否可以编辑
  const [trainEdit, setTrainEdit] = useState(false);//培训信息是否可以编辑
  const [tableData, setTableData] = useState([]);//培训完成情况data
  const [isAuth, setIsAuth] = useState(false);//是否拥有编辑权限

  /**
   * 培训信息查询接口
   * @return {*}
   */
  const handleQuery = () => {
    fetch(`http://localhost:3000/api/query/train-info/${record.key}`)
      .then(response => response.json())
      .then(data => {
        trainForm.setFieldsValue({
          ...data
        })
        setTableData(data.content)
      })
      .catch(error => console.error('发生错误：', error));
  }

  useEffect(() => {
    handleQuery();
    //在此判断用户是否为jimmyl@hutch-med.com,是则可以编辑
    // if(userName==='jimmyl@hutch-med.com')
    // setIsAuth(true)
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
        message.warning(intl.formatMessage({ id: 'warn.validate.error', defaultMessage: '校验失败，请检查表单输入' }));
        console.log('Validation error:', error);
      });
  };

  /**
   * 培训信息-保存
   * @return {*}
   */
  const trainInfoSave = () => {
    const values = trainForm.getFieldsValue();
    const obj = {
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
  const handleTableData = (row) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index > -1) {
      newData.splice(index, 1, row);
      setTableData(newData);
    }
  }

  //培训完成情况列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'detail.title.percent', defaultMessage: '完成%' }),
      dataIndex: 'percent',
      render: (_, row) => (
        <EditableCell
          dataIndex='percent'
          record={row}
          rules={[{ required: true, message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }) }]}
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
          rules={[{ required: true, message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }) }]}
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
          rules={[{ required: true, message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }), }]}
          onSave={(value) => handleTableData({ ...row, predictDate: value })}
          editing={trainEdit}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.operation', defaultMessage: '操作' }),
      dataIndex: 'operation',
      render: (_, row) => (
        <Button type="link" onClick={() => handleDelete(row.key)} disabled={!trainEdit}>
          {intl.formatMessage({ id: 'detail.operation.delete', defaultMessage: '删除' })}
        </Button>
      ),
    },
  ];

  // 处理删除行事件
  const handleDelete = (key) => {
    const newData = tableData.filter(item => item.key !== key);
    setTableData(newData);
  };

  // 处理新增行事件
  const handleAdd = () => {
    const newData = [...tableData, {
      key: tableData.length + 1, // 使用当前数量+1作为新行的唯一标识
      percent: '',
      finishDate: '',
      predictDate: '',
    }];
    setTableData(newData);
  };

  const items = [
    {
      key: '1',
      collapsible: 'icon',
      label: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {intl.formatMessage({ id: 'detail.title.basic', defaultMessage: '基本信息' })}
        {editing ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => { form.setFieldsValue(record); setEditing(false); }}>
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
          span: 4,
        }}
        wrapperCol={{
          span: 12,
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
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.fileName}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.description', defaultMessage: '描述' })}
          name="description"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.description}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.department', defaultMessage: '发布部门' })}
          name="department"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.department}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.contact', defaultMessage: '联系人' })}
          name="contact"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.contact}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.range', defaultMessage: '适用范围' })}
          name="range"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.range}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.fileNo', defaultMessage: '文件编号' })}
          name="fileNo"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.fileNo}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.type', defaultMessage: '文件类型' })}
          name="type"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.type}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.language', defaultMessage: '语言' })}
          name="language"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.language}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.version', defaultMessage: '版本号' })}
          name="version"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.version}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.changeTime', defaultMessage: '修订时间' })}
          name="date"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.date}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.content', defaultMessage: '修订内容' })}
          name="content"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.content}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'list.title.source', defaultMessage: '来源' })}
          name="source"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <span>{record.source}</span>
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.title.file', defaultMessage: '文档' })}
          name="fileUrl"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
            },
          ]}
        >
          {editing ? (<Input />) : (
            <a onClick={() => window.open(record.fileUrl)}>{record.fileUrl}</a>
          )}
        </Form.Item>
      </Form>,
    },
    {
      key: '2',
      collapsible: 'icon',
      label: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {intl.formatMessage({ id: 'detail.title.train', defaultMessage: '培训信息' })}
        {trainEdit ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => { setTrainEdit(false); handleQuery() }}>
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
            span: 4
          }}
          wrapperCol={{
            span: 12,
          }}
          autoComplete="off"
        >
          <Form.Item
            label={intl.formatMessage({ id: 'detail.title.platform', defaultMessage: '培训平台' })}
            name="platform"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
              },
            ]}
          >
            {trainEdit ? (<Input />) : (
              <span>{trainForm.getFieldValue('platform')}</span>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'detail.title.class', defaultMessage: '培训课程名称' })}
            name="trainName"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'warn.required', defaultMessage: '请输入' }),
              },
            ]}
          >
            {trainEdit ? (<Input />) : (
              <span>{trainForm.getFieldValue('trainName')}</span>
            )}
          </Form.Item>
          {trainEdit && <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
            {intl.formatMessage({ id: 'detail.operation.add', defaultMessage: '新增' })}
          </Button>}
          <Table
            bordered
            dataSource={tableData}
            columns={columns
            }
            pagination={false}
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
          onClick={() => { props.updateTitle('title.corporate.policy'); history.go(-1) }}>{intl.formatMessage({ id: 'common.btn.back', defaultMessage: '返回' })}</Button>
        <Collapse items={items} defaultActiveKey={['1', '2']} />
      </Content>
    </Layout>
  </>
}

export default DetailPage