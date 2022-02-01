export default (Sequelize, DataTypes) => {
  const Class = Sequelize.define("class", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_type_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    times_per_week: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    id_assigned_discipline: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Class.associate = (models) => {
    Class.belongsTo(models.assigned_discipline, {
      foreignKey: "id_assigned_discipline",
    });
    Class.belongsTo(models.type_class, {
      foreignKey: "id_type_class",
    });
    Class.hasMany(models.recommended_audience, {
      foreignKey: "id_class",
    });
    Class.hasMany(models.assigned_teacher, {
      foreignKey: "id_class",
      required: true,
    });
    Class.hasMany(models.assigned_group, {
      foreignKey: "id_class",
      required: true,
    });
    Class.belongsToMany(models.audience, {
      foreignKey: "id_class",
      through: models.recommended_audience,
    });
    Class.belongsToMany(models.teacher, {
      foreignKey: "id_class",
      through: models.assigned_teacher,
      required: true,
    });
    Class.belongsToMany(models.group, {
      foreignKey: "id_class",
      through: models.assigned_group,
      required: true,
    });
  };
  return Class;
};
