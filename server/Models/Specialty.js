export default (Sequelize, DataTypes) => {
  const Specialty = Sequelize.define("specialty", {
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
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Specialty.associate = (models) => {
    Specialty.belongsTo(models.cathedra, { foreignKey: "id_cathedra" });
    Specialty.hasMany(models.assigned_discipline, {
      foreignKey: "id_specialty",
    });
    /*Specialty.belongsToMany(models.discipline, { foreignKey: "id_specialty", through: models.assigned_discipline});*/
  };
  return Specialty;
};
