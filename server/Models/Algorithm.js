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
      type: DataTypes.STRING(10000),
    },
  });
  Algorithm.associate = (models) => {
    Algorithm.hasMany(models.results_algorithm, {
      foreignKey: "name_algorithm",
    });
  };
  return Algorithm;
};
