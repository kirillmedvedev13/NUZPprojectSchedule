export default (Sequelize, DataTypes) => {
  const Results_algorithm = Sequelize.define("results_algorithm", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    params_value: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    name_algorithm: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    results: {
      type: DataTypes.TEXT("long"),
    },
  });
  Results_algorithm.associate = (models) => {
    Results_algorithm.belongsTo(models.algorithm, {
      foreignKey: "name_algorithm",
      onDelete: "cascade",
    });
  };
  return Results_algorithm;
};
