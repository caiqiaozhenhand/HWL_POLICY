/*
 * @Descripttion: Content
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 14:00:28
 */
import { useState  } from 'react'
import {   Modal,Layout,Flex, Button } from 'antd'
import {  Route, Switch,useLocation } from 'react-router-dom';
import './App.css';
import DetailPage from './DetailPage';
import HomePage from './HomePage';
import { FormattedMessage, IntlProvider } from 'react-intl';
import messages_zh from './locales/zh-CN.json'; // 中文语言包
import messages_en from './locales/en-US.json'; // 英文语言包

const { Header,  Content } = Layout;

const messages = {
  'zh-CN': messages_zh,
  'en-US': messages_en,
};
const headerStyle = {
  color: 'black',
  height: 100,
  padding: 0,
  lineHeight: '64px',
  backgroundColor: 'white',
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);//是否展示用户帮助modal
  const [locale, setLocale] = useState('zh-CN'); // 当前语言环境，默认为中文

  const pathname = useLocation().pathname;
  let title = 'Leading Page – Corporate Policy';
     if (pathname === '/') {
      title = 'Leading Page – Corporate Policy';
    } else if (pathname.startsWith('/detail')) {
      title = 'Details of SOP';
    }

    const toggleLocale = () => {
      const newLocale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
      setLocale(newLocale);
    };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
    <Header style={headerStyle}>
    <Flex gap="middle" align="start" vertical>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <h3>{title}</h3>
      <div>
      <Button onClick={toggleLocale}>中/EN</Button>
        <a style={{marginLeft: '2rem', width: 70, display:'inline-block'}} onClick={() => setIsModalOpen(true)}>
        <FormattedMessage id="header.help" defaultMessage="用户帮助" />
        </a>
      </div>
      </div>
    </Flex>
  </Header>
  <Content>
  <Switch>
    <Route  exact path="/" component={HomePage} />
    <Route  path="/detail/:id" component={DetailPage} />
  </Switch>
  <Modal title="用户帮助" open={isModalOpen} okText='确认' cancelText='取消' onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
  <p>待补充...</p>
</Modal>
  </Content>
  </IntlProvider>
  )
}

export default App
