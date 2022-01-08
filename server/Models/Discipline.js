export default (Sequelize, DataTypes) => {
  const Discipline = Sequelize.define("discipline", {
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

  Discipline.associate = (models) => {
    Discipline.hasMany(models.assigned_discipline, {
      foreignKey: "id_discipline",
    });
    Discipline.hasMany(models.classes, { foreignKey: "id_discipline" });
    Discipline.belongsToMany(models.specialty, {
      foreignKey: "id_discipline",
      through: models.assigned_discipline,
    });
  };
  return Discipline;
};
