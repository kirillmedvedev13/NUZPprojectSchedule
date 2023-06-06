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
  };
  return Discipline;
};
