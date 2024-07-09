/*
 * @Descripttion: 
 * @Author: qiaozhen.cai
 * @Date: 2024-07-08 16:26:51
 */
import { createIntl, createIntlCache } from 'react-intl';

// 中文语言包
import zh_CN from 'antd/lib/locale/zh_CN';
// 英文语言包
import en_US from 'antd/lib/locale/en_US';

const locales = {
  'zh-CN': zh_CN,
  'en-US': en_US,
};

const cache = createIntlCache();

export const getIntl = async (locale) => {
  let messages;
  try {
    messages = await import(`./locales/${locale}.json`); // 使用import语法动态导入JSON文件
  } catch (error) {
    console.error(`Failed to load locale ${locale}:`, error);
    messages = {}; // 处理加载失败的情况
  }
  return createIntl(
    {
      locale,
      messages,
    },
    cache
  );
};

export default locales;
