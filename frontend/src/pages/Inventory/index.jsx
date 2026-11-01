import CrudModule from '@/modules/CrudModule/CrudModule';
import InventoryForm from '@/forms/InventoryForm';
import useLanguage from '@/locale/useLanguage';

export default function Inventory() {
  const translate = useLanguage();
  const product = translate('product');
  const quantity = translate('quantity');
  const inventory = translate('inventory');
  const config = {
    entity: 'inventory',
    searchConfig: { displayLabels: ['productName'], searchFields: 'product' },
    deleteModalLabels: ['quantity'],
    readColumns: [
      { title: product, dataIndex: 'product.name' },
      { title: quantity, dataIndex: 'quantity' },
    ],
    dataTableColumns: [
      { title: product, dataIndex: ['product', 'name'] },
      { title: quantity, dataIndex: 'quantity' },
    ],
    PANEL_TITLE: inventory,
    DATATABLE_TITLE: inventory,
    ADD_NEW_ENTITY: translate('add_new_inventory'),
    ENTITY_NAME: inventory,
  };
  return <CrudModule config={config} createForm={<InventoryForm />} updateForm={<InventoryForm />} />;
}
