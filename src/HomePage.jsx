/*
 * @Descripttion: 列表页
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 14:00:28
 */
import { useState, useEffect } from 'react'
import { Menu, Flex, Table, Layout, Select, Input } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons';
import './App.css';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

//侧边栏数据
export const menuItems = [
  {
    key: '1',
    icon: <AppstoreOutlined />,
    label: <FormattedMessage id="menu.corporate.policy" defaultMessage="集团政策" />,
  },
  {
    key: '2',
    icon: <AppstoreOutlined />,
    label: <FormattedMessage id="menu.functional.policy" defaultMessage="职能政策" />,
    children: [
      { key: '21', label: <FormattedMessage id="menu.business.development" defaultMessage="商务开发" /> },
      { key: '22', label: <FormattedMessage id="menu.legal" defaultMessage="法务" /> },
      { key: '23', label: <FormattedMessage id="menu.investor.capital" defaultMessage="投资者关系和资本战略" /> },
      { key: '24', label: <FormattedMessage id="menu.corporate.communications" defaultMessage="企业管理与传播" /> },
      { key: '25', label: <FormattedMessage id="menu.operation.risk" defaultMessage="运营与风险管理" /> },
      { key: '26', label: <FormattedMessage id="menu.EHS" defaultMessage="环境健康与安全" /> },
      {
        key: '27',
        label: <FormattedMessage id="menu.quality.assurance" defaultMessage="质量保证管理" />,
        children: [
          { key: '271', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
        ],
      },
      { key: '28', label: <FormattedMessage id="menu.human.resource" defaultMessage="人力资源管理" /> },
      { key: '29', label: <FormattedMessage id="menu.procurement" defaultMessage="采购" /> },
      { key: '30', label: <FormattedMessage id="menu.government.affairs" defaultMessage="政府事务" /> },
      { key: '31', label: <FormattedMessage id="menu.finance" defaultMessage="财务" /> },
      { key: '32', label: <FormattedMessage id="menu.tax" defaultMessage="税务" /> },
      { key: '33', label: <FormattedMessage id="menu.personal.protection" defaultMessage="个人信息保护" /> },
      { key: '34', label: <FormattedMessage id="menu.chop.management" defaultMessage="公章管理" /> },
      {
        key: '35',
        label: <FormattedMessage id="menu.info.technolofy" defaultMessage="信息技术" />,
        children: [
          { key: '351', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '352', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      { key: '36', label: <FormattedMessage id="menu.compliance" defaultMessage="合规" /> },
      { key: '37', label: <FormattedMessage id="menu.administration" defaultMessage="行政" /> },
      { key: '38', label: <FormattedMessage id="menu.OBD.commercial" defaultMessage="OBD商务" /> },
      { key: '39', label: <FormattedMessage id="menu.OBD.solid" defaultMessage="OBD血液瘤" /> },
      { key: '40', label: <FormattedMessage id="menu.OBD.malignancy" defaultMessage="OBD实体瘤" /> },
      {
        key: '41',
        label: <FormattedMessage id="menu.clinical.operation" defaultMessage="临床运营" />,
        children: [
          { key: '411', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
        ],
      },
      {
        key: '42',
        label: <FormattedMessage id="menu.medical" defaultMessage="医学" />,
        children: [
          { key: '421', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
        ],
      },
      {
        key: '43',
        label: <FormattedMessage id="menu.biometrics" defaultMessage="生物统计" />,
        children: [
          { key: '431', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
        ],
      },
      {
        key: '44',
        label: <FormattedMessage id="menu.medical.affairs" defaultMessage="医学事务" />,
        children: [
          { key: '441', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
        ],
      },
      {
        key: '45',
        label: <FormattedMessage id="menu.regulatory.affairs" defaultMessage="注册事务" />,
        children: [
          { key: '451', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
        ],
      },
      {
        key: '46',
        label: <FormattedMessage id="menu.chemistry" defaultMessage="化学" />,
        children: [
          { key: '461', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '462', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '47',
        label: <FormattedMessage id="menu.biologics.research" defaultMessage="生物药研究" />,
        children: [
          { key: '471', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '472', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '48',
        label: <FormattedMessage id="menu.DMPK" defaultMessage="药物代谢与动力学" />,
        children: [
          { key: '481', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '482', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '49',
        label: <FormattedMessage id="menu.oncology" defaultMessage="肿瘤研究" />,
        children: [
          { key: '491', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '492', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '50',
        label: <FormattedMessage id="menu.translational" defaultMessage="转化医学" />,
        children: [
          { key: '501', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '502', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '51',
        label: <FormattedMessage id="menu.biologics.cmc" defaultMessage="生物药CMC" />,
        children: [
          { key: '511', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '512', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '52',
        label: <FormattedMessage id="menu.formulation" defaultMessage="药剂制剂" />,
        children: [
          { key: '521', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '522', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '53',
        label: <FormattedMessage id="menu.analytical" defaultMessage="分析开发" />,
        children: [
          { key: '531', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '532', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '54',
        label: <FormattedMessage id="menu.process.chemistry" defaultMessage="工艺化学" />,
        children: [
          { key: '541', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '542', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '55',
        label: <FormattedMessage id="menu.supply.chain" defaultMessage="供应链管理" />,
        children: [
          { key: '551', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '552', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '56',
        label: <FormattedMessage id="menu.SH.operation" defaultMessage="上海工厂运营" />,
        children: [
          { key: '561', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '562', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '57',
        label: <FormattedMessage id="menu.SH.quality" defaultMessage="上海工厂质量" />,
        children: [
          { key: '571', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '572', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      { key: '58', label: <FormattedMessage id="menu.SH.procurement" defaultMessage="上海工厂采购" /> },
      { key: '59', label: <FormattedMessage id="menu.SH.admin" defaultMessage="上海工厂行政" /> },
      { key: '60', label: <FormattedMessage id="menu.SH.finance" defaultMessage="上海工厂财务" /> },
      {
        key: '61',
        label: <FormattedMessage id="menu.SZ.operation" defaultMessage="苏州工厂运营" />,
        children: [
          { key: '611', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '612', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      {
        key: '62',
        label: <FormattedMessage id="menu.SZ.quality" defaultMessage="苏州工厂质量" />,
        children: [
          { key: '621', label: <FormattedMessage id="menu.quality.system" defaultMessage="质量体系相关" /> },
          { key: '622', label: <FormattedMessage id="menu.others" defaultMessage="其他" /> },
        ],
      },
      { key: '63', label: <FormattedMessage id="menu.SZ.finance" defaultMessage="苏州工厂财务" /> },
      { key: '64', label: <FormattedMessage id="menu.SZ.HR" defaultMessage="苏州工厂人力资源管理" /> },
      { key: '65', label: <FormattedMessage id="menu.Beijing" defaultMessage="北京办" /> },

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

function HomePage(props) {
  const [selectedKeys, setStateSelectedKeys] = useState('');//选中的menu
  const [searchText, setSearchText] = useState('');//输入框内容
  const [selectVal, setSelectVal] = useState('');//下拉框选择内容 
  const [sourceData, setSourceData] = useState([]);//原始数据
  const [filterData, setFilteredData] = useState([]);//筛选后数据
  const intl = useIntl();

  const pathname = useLocation().pathname;

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
          return item.level1?.includes(selectedKeys[0]);
        } else if (selectedKeys.length === 2) {
          // 二级菜单
          return item.level2?.includes(selectedKeys[0]);
        } else if (selectedKeys.length === 3) {
          // 三级菜单
          return item.level3?.includes(selectedKeys[0]);
        }
        return true;
      });
    }
    setFilteredData(filteredData);
  };

  useEffect(() => {
    //下拉框、输入框、侧边栏改变则调用applyFilters
    applyFilters();
  }, [selectedKeys, searchText, selectVal]);


  //列配置
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
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'list.title.department', defaultMessage: '归属部门' }),
      dataIndex: 'department',
      key: 'department',
      width: 110,
    },
    {
      title: intl.formatMessage({ id: 'list.title.source', defaultMessage: '来源' }),
      dataIndex: 'source',
      key: 'source',
      width: 80,
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
        <Link to={{
          pathname: `/detail/${record.key}`,
          state: { record: record }
        }}>
          {intl.formatMessage({ id: 'list.content.detail', defaultMessage: '查看详情' })}
        </Link>
      ),
    },
  ];

  /**
   * 侧边栏点击，更新title
   * @param {*} e
   * @return {*}
   */
  const handleMenuClick = (e) => {
    setStateSelectedKeys(e.keyPath);
    if (pathname === '/') {
      props.updateTitle(e.keyPath?.includes('1') ?  'title.corporate.policy' : 'title.functional.policy')
    }
  }

  return (
    <>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Flex gap="middle" align="start" vertical>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', width: '50vw', gap: 20 }} >
                <Select
                  style={{
                    minWidth: '50%',
                    textAlign: 'left'
                  }}
                  mode="multiple"
                  maxTagCount={2}
                  allowClear
                  onChange={val => setSelectVal(val)}
                  placeholder={intl.formatMessage({ id: 'warn.please.select', defaultMessage: intl.formatMessage({ id: 'warn.please.select', defaultMessage: '请勾选' }) })}
                  options={[
                    { value: '1', label: intl.formatMessage({ id: 'select.option.SH', defaultMessage: '和记黄埔医药（上海）有限公司' }) },
                    { value: '2', label: intl.formatMessage({ id: 'select.option.SZ', defaultMessage: '和记黄埔医药（苏州） 有限公司' }) },
                    { value: '3', label: intl.formatMessage({ id: 'select.option.GY', defaultMessage: '国药控股和记黄埔医药（上海）有限公司' }) },
                    { value: '4', label: intl.formatMessage({ id: 'select.option.BJP', defaultMessage: '和黄健宝保健品有限公司' }) },
                    { value: '5', label: intl.formatMessage({ id: 'select.option.SHHH', defaultMessage: '上海和黄药业有限公司' }) },
                    { value: '6', label: intl.formatMessage({ id: 'select.option.HK', defaultMessage: 'HUTCHMED (Hong Kong) Limited' }) },
                    { value: '7', label: intl.formatMessage({ id: 'select.option.International', defaultMessage: 'HUTCHMED International Corporation' }) },
                    { value: '8', label: intl.formatMessage({ id: 'select.option.US', defaultMessage: 'HUTCHMED US Corporation' }) },
                    { value: '9', label: intl.formatMessage({ id: 'select.option.BV', defaultMessage: 'HUTCHMED Europe B.V.' }) },
                  ]}
                />
                <Search placeholder={intl.formatMessage({ id: 'warn.please.input', defaultMessage: '请输入搜索关键词' })} onSearch={(val) => setSearchText(val)} enterButton />
              </div>
            </div>
          </Flex>
        </Header>
        <Layout>
          <Sider width="18%" style={siderStyle}>
            <Menu
              mode="inline"
              defaultOpenKeys={['1', '2']}
              items={menuItems}
              onClick={handleMenuClick}
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
                showTotal: () => `${intl.formatMessage({ id: 'common.page.total', defaultMessage: '共{total}条' }, { total: filterData.length })}`
              }}
            />
          </Content>

        </Layout>
      </Layout>
    </>
  )
}

export default HomePage
