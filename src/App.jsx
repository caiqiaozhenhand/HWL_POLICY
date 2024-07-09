/*
 * @Descripttion: 入口文件
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 14:00:28
 */
import React from 'react'
import {  ConfigProvider, } from 'antd'
import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Content from './Content';
import { getIntl } from './i18n';

function App() {
  const locale = 'zh-CN'; // 默认语言环境

const intl = getIntl(locale);

  return (
    <Router>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: '#8e1e67',
              horizontalItemHoverColor: '#8e1e67',
              itemSelectedColor: '#8e1e67',
              itemActiveBg: '#f2e7ef',
              itemSelectedBg: '#f2e7ef',
            },
            Button: {
              colorPrimary: '#8e1e67',
              defaultActiveBorderColor: '#8e1e67',
            },
            Input: {
              activeBorderColor: '#8e1e67'
            }
          },
          token: {
            colorPrimary: '#8e1e67',
          }
        }}
      >
        <Content intl={intl} />
      </ConfigProvider>
    </Router>
  )
}

export default App
