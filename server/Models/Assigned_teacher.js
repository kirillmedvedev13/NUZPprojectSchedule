export default (Sequelize, DataTypes) => {
  const Assigned_teacher = Sequelize.define("assigned_teacher", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_teacher: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Assigned_teacher.associate = (models) => {
    Assigned_teacher.belongsTo(models.teacher, {
      foreignKey: "id_teacher",
      required: true,
    });
    Assigned_teacher.belongsTo(models.class, {
      foreignKey: "id_class",
      required: true,
    });
  };

  return Assigned_teacher;
};
