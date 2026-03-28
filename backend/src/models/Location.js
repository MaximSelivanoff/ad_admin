const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Location', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    code: { type: DataTypes.STRING, unique: true },
    address: { type: DataTypes.STRING }
  }, { tableName: 'locations', timestamps: false });
};
