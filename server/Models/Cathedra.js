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
    short_name: {
      type: DataTypes.STRING(10),
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
    Cathedra.hasMany(models.teacher, {
      foreignKey: "id_cathedra",
    });
    Cathedra.hasMany(models.assigned_audience, {
      foreignKey: "id_cathedra",
    });
  };
  return Cathedra;
};
