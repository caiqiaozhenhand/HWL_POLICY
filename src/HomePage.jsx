/*
 * @Descripttion: 列表页
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 14:00:28
 */
import { useState, useEffect } from 'react'
import './App.css'
import { Menu, Flex, Table, Layout, Select, Input, ConfigProvider, Modal } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons';
import './App.css';
import DetailPage from './DetailPage';
import { Link,useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const items = [
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

const headerStyle = {
  color: 'black',
  padding: 0,
  lineHeight: '64px',
  backgroundColor: 'white',
};

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


function App(props) {
  const [selectedKeys, setStateSelectedKeys] = useState('');//选中的menu
  const [searchText, setSearchText] = useState('');//输入框内容
  const [selectVal, setSelectVal] = useState('');//下拉框选择内容 
  const [sourceData, setSourceData] = useState([]);//原数据
  const [filterData, setFilteredData] = useState([]);//筛选后数据
  const [isModalOpen, setIsModalOpen] = useState(false);//是否展示用户帮助modal
const [showDrawer, setShowDrawer]=useState(false);//是否展示详情
const [params, setParams]=useState({});//props传参
const intl = useIntl();

  useEffect(() => {
    fetch('http://localhost:3000/api/query/list')
      .then(response => response.json())
      .then(data => {
        setFilteredData(data)
        setSourceData(data)
      })
      .catch(error => console.error('发生错误：', error));
  }, [])

  /**
   * 查看详情
   * @param {*} record
   * @return {*}
   */  
  const openDetail=(record)=>{
    const obj={record, backToList}
    setParams(obj)
   setShowDrawer(true)
  }

  /**
   * 返回列表页
   * @return {*}
   */  
  const backToList = () => {
    fetch('http://localhost:3000/api/query/list')
    .then(response => response.json())
    .then(data => {
      setFilteredData(data)
      setSourceData(data)
    })
    .catch(error => console.error('发生错误：', error));
    setShowDrawer(false)
  }


  /**
   * 筛选数据
   * @return {*}
   */  
  const applyFilters = () => {
    let filteredData = sourceData;
    // 根据 下拉框 筛选
    if (selectVal.length > 0) {
      filteredData = filteredData.filter(item => {
        return item.scope?.split(',')?.some(e => selectVal.includes(e));
      });
    }

    // 根据 输入框 筛选
    if (searchText.trim() !== '') {
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    // 根据 menu 筛选
    if (selectedKeys.length > 0) {
      filteredData = filteredData.filter(item => {
        // 根据点击的菜单项的不同层级来筛选数据
        if (selectedKeys.length === 1) {
          // 一级菜单
          return item.level1 === selectedKeys[0];
        } else if (selectedKeys.length === 2) {
          // 二级菜单
          return item.level2 === selectedKeys[0];
        } else if (selectedKeys.length === 3) {
          // 三级菜单
          return item.level3 === selectedKeys[0];
        }
        return true; // 默认返回true，不做过滤
      });
    }
    setFilteredData(filteredData);
  };


  useEffect(() => {
    applyFilters();
  }, [selectedKeys, searchText, selectVal]);


  const columns = [
    {
      title: intl.formatMessage({ id: 'list.title.name', defaultMessage: '名称' }),
      dataIndex: 'fileName',
      key: 'fileName',
      width: 180,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'list.title.description', defaultMessage: '描述' }),
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: intl.formatMessage({ id: 'list.title.fileNo', defaultMessage: '文件编号' }),
      dataIndex: 'fileNo',
      key: 'fileNo',
      width: 210,
    },
    {
      title: intl.formatMessage({ id: 'list.title.type', defaultMessage: '文件类型' }),
      key: 'type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'list.title.date', defaultMessage: '发布日期' }),
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'list.title.version', defaultMessage: '版本' }),
      dataIndex: 'version',
      key: 'version',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'list.title.department', defaultMessage: '归属部门' }),
      dataIndex: 'department',
      key: 'department',
      width: 90,
    },
    {
      title: intl.formatMessage({ id: 'list.title.source', defaultMessage: '来源' }),
      dataIndex: 'source',
      key: 'source',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'list.title.language', defaultMessage: '语言' }),
      dataIndex: 'language',
      key: 'language',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'list.title.train', defaultMessage: '培训完成情况' }),
      dataIndex: 'train',
      key: 'train',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'list.title.action', defaultMessage: '文档链接' }),
      key: 'action',
      width: 120,
      render: (_, record) => (
                      <Link  to={{
              pathname: `/detail/${record.key}`,
              state: { record: record } 
            }}>{intl.formatMessage({ id: 'list.content.detail', defaultMessage: '查看详情' })}</Link>
      ),
    },
  ];


  return (
    <>
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>
            <Flex gap="middle" align="start" vertical>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', width: '30%', gap: 20 }} >
                  <Select
                    style={{
                      width: 300,
                      textAlign: 'left'
                    }}
                    mode="multiple"
                    allowClear
                    onChange={val => setSelectVal(val)}
                    placeholder='请勾选'
                    options={[
                      {
                        value: '1',
                        label: 'HMPL',
                      },
                      {
                        value: '2',
                        label: 'HSPL',
                      },
                      {
                        value: '3',
                        label: 'HMPS',
                      },
                    ]}
                  />
                  <Search placeholder="请输入搜索关键词" onSearch={(val) => setSearchText(val)} enterButton />
                </div>
              </div>
            </Flex>
          </Header>
          <Layout>
            <Sider width="25%" style={siderStyle}>
              <Menu
                mode="inline"
                defaultOpenKeys={['1', '2']}
                items={items}
                onClick={(e) => setStateSelectedKeys(e.keyPath)}
              />
            </Sider>
            <Content >
              <Table
                columns={columns}
                dataSource={filterData}
                scroll={{
                  x: 1560,
                }}
                pagination={{
                  showTotal: () => `${intl.formatMessage({ id: 'common.page.total', defaultMessage: '共{total}条' },{total: filterData.length})}`
                }}
              />
            </Content>
            
          </Layout>
        </Layout>
    </>
  )
}

export default App
