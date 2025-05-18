/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shop_order', {
    billNo: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    payCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    billDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    billAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    prefAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    payableAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    paidAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    billStatus: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'P'
    },
    addrName: {
      type: DataTypes.STRING(12),
      allowNull: true,
    }, addrPhone: {
      type: DataTypes.STRING(18),
      allowNull: true,
    }, 
    addrAddress: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    addrZip: {
      type: DataTypes.STRING(8),
      allowNull: false,
    }, 
    addrCity: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'shop_order'
  });
};
