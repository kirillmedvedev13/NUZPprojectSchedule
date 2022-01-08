export default (Sequelize, DataTypes) => {
  const Cathedra = Sequelize.define("cathedra", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });

  Cathedra.associate = (models) => {
    Cathedra.hasMany(models.specialty, {foreignKey: "id_cathedra",});
    Cathedra.belongsToMany(models.audience, {foreignKey: "id_cathedra", through: models.assigned_audience});
  };
  return Cathedra;
};
