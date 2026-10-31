import { Form, InputNumber } from 'antd';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import useLanguage from '@/locale/useLanguage';

export default function InventoryForm() {
  const translate = useLanguage();

  return (
    <>
      <Form.Item name="product" label={translate('product')} rules={[{ required: true }]}>
        <AutoCompleteAsync entity="product" displayLabels={['name']} searchFields="name" />
      </Form.Item>
      <Form.Item name="quantity" label={translate('quantity')} rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}
