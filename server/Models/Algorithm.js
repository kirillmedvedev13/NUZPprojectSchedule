export default (Sequelize, DataTypes) => {
  const Algorithm = Sequelize.define("algorithm", {
    name: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    params: {
      type: DataTypes.STRING(1000),
    },
    results: {
      type: DataTypes.TEXT("long"),
    },
  });
  return Algorithm;
};
