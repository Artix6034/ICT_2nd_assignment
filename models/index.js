const User = require('./User');
const Trade = require('./Trade');
const { Portfolio, Asset } = require('./Portfolio');
const ApiKey = require('./ApiKey');

// Define relationships
User.hasMany(Trade, {
  foreignKey: 'userId',
  as: 'trades',
  onDelete: 'CASCADE'
});

Trade.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasOne(Portfolio, {
  foreignKey: 'userId',
  as: 'portfolio',
  onDelete: 'CASCADE'
});

Portfolio.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(ApiKey, {
  foreignKey: 'userId',
  as: 'apiKeys',
  onDelete: 'CASCADE'
});

ApiKey.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = {
  User,
  Trade,
  Portfolio,
  Asset,
  ApiKey
};
