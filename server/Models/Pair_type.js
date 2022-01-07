export default (Sequelize, DataTypes) => {
  const Pair_type = Sequelize.define("pair_type", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    parity: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
  });
  return Pair_type;
};
