const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const controller = createCRUDController('Inventory');

// Inventory holds a product ObjectId, so search by product name in its collection.
controller.search = async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.status(202).json({ success: false, result: [], message: 'No search term' });
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const products = await mongoose.model('Product').find({ removed: false, name: new RegExp(escaped, 'i') }).select('_id');
  const records = await mongoose.model('Inventory').find({ removed: false, product: { $in: products.map((p) => p._id) } }).limit(10);
  const result = records.map((record) => ({ ...record.toObject(), productName: record.product?.name || '' }));
  return res.status(result.length ? 200 : 202).json({ success: result.length > 0, result });
};

module.exports = controller;
