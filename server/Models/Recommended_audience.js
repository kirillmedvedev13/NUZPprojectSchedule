export default (Sequelize, DataTypes) => {
  const Recommended_audience = Sequelize.define("recommended_audience", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_audience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Recommended_audience.associate = (models) => {
    Recommended_audience.belongsTo(models.audience, {
      foreignKey: "id_audience",
    });
    Recommended_audience.belongsTo(models.class, {
      foreignKey: "id_class",
    });
  };
  return Recommended_audience;
};
