const { v4 } = require('uuid');

module.exports = (knex) => {
  function findAllTradesFromPlayer(playerUuid) {
    return knex('trade')
      .select('*')
      .where({ proposer: playerUuid })
      .orWhere({ acceptor: playerUuid })
      .orderBy('sentAt', 'desc');
  }

  function getItemsFromPlayer(playerUuid, items) {
    return knex('item')
      .select('*')
      .whereIn('uuid', items)
      .andWhere({ owner: playerUuid });
  }

  function getUntradeableItems(itemsUuid) {
    return knex('item')
      .select('item.*')
      .rightJoin('itemtrade', { 'item.uuid': 'itemtrade.item' })
      .leftJoin('trade', { 'itemtrade.trade': 'trade.uuid' })
      .whereIn('item.uuid', itemsUuid)
      .andWhere('trade.status', 'PENDING');
  }

  function createTrade(proposer, acceptor, offeredItems, requestedItems) {
    const tradeUuid = v4();
    const tradeItems = [];

    offeredItems.forEach((itemUuid) => {
      tradeItems.push({
        uuid: v4(),
        item: itemUuid,
        trade: tradeUuid,
        recipient: acceptor,
      });
    });

    requestedItems.forEach((itemUuid) => {
      tradeItems.push({
        uuid: v4(),
        item: itemUuid,
        trade: tradeUuid,
        recipient: proposer,
      });
    });

    return knex.transaction((trx) => trx('trade')
      .insert({
        uuid: tradeUuid,
        proposer,
        acceptor,
      })
      .then(() => trx('itemtrade').insert(tradeItems)));
  }

  return {
    findAllTradesFromPlayer, getItemsFromPlayer, getUntradeableItems, createTrade,
  };
};
