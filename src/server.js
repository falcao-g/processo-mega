const api = require('express')();
require('dotenv').config();
const authRouter = require('./auth/auth.route');
const inventoryRouter = require('./inventory/inventory.route');
const tradeRouter = require('./trade/trade.route');
const lootboxRouter = require('./lootbox/lootbox.route');

const port = process.env.PORT;

api.listen(port, () => {
  console.log(`API running on ${port}`);
});

api.get('/', (req, res) => {
  res.send({ message: 'API online!' });
});

api.use('/auth', authRouter);
api.use('/inventory', inventoryRouter);
api.use('/trade', tradeRouter);
api.use('/lootbox', lootboxRouter);
