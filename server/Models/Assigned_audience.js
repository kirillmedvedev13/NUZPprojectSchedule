export default (Sequelize, DataTypes) => {
  const Assigned_audience = Sequelize.define("assigned_audience", {
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
    id_cathedra: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Assigned_audience.associate = (models) => {
    Assigned_audience.belongsTo(models.cathedra, {
      foreignKey: "id_cathedra",
    });
    Assigned_audience.belongsTo(models.audience, {
      foreignKey: "id_audience",
    });
  };

  return Assigned_audience;
};
