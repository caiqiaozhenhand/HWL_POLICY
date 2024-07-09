import   {  useState } from 'react';
import { Form, Input } from 'antd';

const EditableCell = ({ editing, dataIndex,  record, rules,onSave }) => {
  const [inputValue, setInputValue] = useState(record[dataIndex]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    onSave(inputValue);
  }

  return (
    <td>
      {editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={`${dataIndex}_${record.key}`}
          initialValue={record[dataIndex]}
          rules={rules}
        >
          <Input value={inputValue} onChange={handleInputChange} onPressEnter={handleSave} onBlur={handleSave} />
        </Form.Item>
      ) : (
        record[dataIndex]
      )}
    </td>
  );
};


export default EditableCell;
