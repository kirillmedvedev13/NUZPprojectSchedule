export default (Sequelize, DataTypes) => {
  const Teacher = Sequelize.define("teacher", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });
  Teacher.associate = (models) => {
    Teacher.hasMany(models.assigned_teacher, { foreignKey: "id_teacher" });
    Teacher.belongsToMany(models.class, {
      foreignKey: "id_teacher",
      through: models.assigned_teacher,
    });
  };

  return Teacher;
};
