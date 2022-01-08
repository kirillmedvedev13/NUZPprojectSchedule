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
    Cathedra.belongsToMany(models.audience, {
      through: models.assigned_audience,
      foreignKey: "id_cathedra",
    });
    Cathedra.hasMany(models.specialty, {
      foreignKey: "id_cathedra",
    });
  };
  return Cathedra;
};