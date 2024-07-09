/*
 * @Descripttion: 
 * @Author: qiaozhen.cai
 * @Date: 2024-07-04 14:07:59
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'

const app = express();
app.use(cors());
app.use(bodyParser());
const port = 3000;

// 列表数据
let data = [
  {
    key: '1',//主键
    fileName: 'Information Security Policy个人信息管理政策',
    description: '防止贿赂及贪污',
    fileNo: 'HMDOC-40000002-01-0001-V02',
    type: 'Policy',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    scope: '1,2',       /** 这里的scope 可以用key或者id 取代名字， 比如 HMPL 为1， HMPS为2等等  **/
    level1: '1',    /** 这里的level 可以用key或者id 取代名字  **/
    level2: '11',
    level3: '',
    use:'',
    fileUrl:'www.baidu.com'
  },
  {
    key: '2',
    fileName: 'Personal Information Protection Standard Operating Procedure	',
    description: '个人信息管理',
    fileNo: 'HMDOC-40000002-02-0001-V01',
    type: 'SOP',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    scope: '2',       /** 这里的scope 可以用key或者id 取代名字， 比如 HMPL 为1， HMPS为2等等  **/
    level1: '1',    /** 这里的level 可以用key或者id 取代名字  **/
    level2: '12',
    level3: '',
  },
  {
    key: '3',
    fileName: 'Information Security Policy个人信息管理政策',
    description: '信息安全',
    fileNo: 'HMDOC-40000002-01-0001-V02',
    type: 'Policy',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    scope: '3',
    level1: '1',    /** 这里的level 可以用key或者id 取代名字  **/
    level2: '13',
    level3: '',
  },
  {
    key: '4',
    fileName: 'Personal Information Protection Standard Operating Procedure	',
    description: '举报',
    fileNo: 'HMDOC-40000002-02-0001-V01',
    type: 'SOP',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    scope: '1,3',
    level1: '1',
    level2:'14'
  },
  {
    key: '5',
    fileName: 'Information Security Policy个人信息管理政策',
    description: 'IT——质量',
    fileNo: 'HMDOC-40000002-01-0001-V02',
    type: 'Policy',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    scope:'3',
    level1: '2',
    level2:'21',
    level3: '211',
  },
  {
    key: '6',
    fileName: 'Personal Information Protection Standard Operating Procedure	',
    description: 'IT——非质量',
    fileNo: 'HMDOC-40000002-02-0001-V01',
    type: 'SOP',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    level1: '2',
    level2:'21',
    level3: '212',
  },
  {
    key: '7',
    fileName: 'Information Security Policy个人信息管理政策',
    description: '内控——质量',
    fileNo: 'HMDOC-40000002-01-0001-V02',
    type: 'Policy',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    level1: '2',
    level2:'22',
    level3: '221',
  },
  {
    key: '8',
    fileName: 'Personal Information Protection Standard Operating Procedure	',
    description: '内控——非质量',
    fileNo: 'HMDOC-40000002-02-0001-V01',
    type: 'SOP',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    level1: '2',
    level2:'22',
    level3: '222',
  },
  {
    key: '9',
    fileName: 'Information Security Policy个人信息管理政策',
    description: '行政',
    fileNo: 'HMDOC-40000002-01-0001-V02',
    type: 'Policy',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    level1: '2',
    level2:'23',
    level3: '',
  },
  {
    key: '10',
    fileName: 'Personal Information Protection Standard Operating Procedure	',
    description: '财务',
    fileNo: 'HMDOC-40000002-02-0001-V01',
    type: 'SOP',
    date: '2023/01/01',
    version: 'V01',
    department: 'Group',
    source: 'Veeva',
    language: '中英双语 Bilingual',
    train: '100%',
    level1: '2',
    level2:'24',
    level3: '',
  },
  {
    key: '11',
    fileName: 'Information Security Policy个人信息管理政策',
    description: '法务',
    fileNo: 'HMDOC-40000002-01-0001-V02',
    type: 'Policy',
    date: '2024/01/01',
    version: 'V01',
    department: 'Group',
    source: 'xxx',
    language: '中英双语 Bilingual',
    train: '50%',
    level1: '2',
    level2:'25',
    level3: '',
  },
  {
    key: '12',
    fileName: 'Personal Information Protection Standard Operating Procedure	',
    description: '基于中国PIPL、欧盟GDPR等相关个人信息保护法律法规制定的SOP，适用于公司全体员工。',
    fileNo: 'HMDOC-40000002-02-0001-V01',
    type: 'SOP',
    date: '2024/06/01',
    version: 'V01',
    department: 'Group',
    source: '？？？',
    language: '韩文',
    train: '100%',
  },
];

//培训信息
const traninData=[
  {
    key:'1',
    trainName: '名称1',
    trainUrl:'url',
    content:[
      {
        key:'1',
percent:'95%',
finishDate:'2024-07-07',
predictDate:'2024-08-09'
      },
      {
        key:'2',
        percent:'100%',
        finishDate:'2024-07-08',
        predictDate:'2024-08-10'
      },
    ]
  },
  {
    key:'2',
    trainName: '名称2',
    trainUrl:'2222',
    content:[
      {
        key:'1',
percent:'50%',
finishDate:'2024-07-07',
predictDate:'2024-08-09'
      },
      {
        key:'2',
        percent:'100%',
        finishDate:'2024-07-08',
        predictDate:'2024-08-10'
      },
    ]
  },
]

// 列表查询
app.get('/api/query/list', (req, res) => {
  res.json(data); 
});

// 基本信息-保存
app.post('/api/basic-detail/save/:key', (req, res) => {
  const { key } = req.params; // 获取 URL 中的 key 参数，用于标识要修改的数据项
  const updatedData = req.body; // 从请求体中获取新数据

  // 找到要修改的数据项在 data 数组中的索引
  const index = data.findIndex(item => item.key === key);

  if (index !== -1) {
    // 更新数据项
    data[index] = {
      ...data[index], // 保留原始数据的其他字段
      ...updatedData // 更新指定字段
    };
    res.status(200).json({ message: '保存成功！', updatedData: data[index] });
  } else {
    res.status(404).json({ message: `Data with key ${key} not found` });
  }
});

// 培训信息-查询
app.get('/api/query/train-info/:key', (req, res) => {
  const { key } = req.params; 
  const data = traninData.find(i=>i.key===key)
  res.json(data); 
});

// 培训信息-保存
app.post('/api/train-detail/save/:key', (req, res) => {
  const { key } = req.params;  
  const updatedData = req.body;  

  const index = traninData.findIndex(item => item.key === key);

  if (index !== -1) {
    traninData[index] = {
      ...traninData[index],  
      ...updatedData ,
      content: updatedData.content   
    };
    res.status(200).json({ message: '保存成功！', updatedData: data[index] });
  } else {
    res.status(404).json({ message: `Data with key ${key} not found` });
  }
});

// 启动 Express 服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});