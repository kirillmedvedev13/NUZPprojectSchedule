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
    Class.hasMany(models.schedule, {foreignKey: "id_class",});
  };
  return Class;
};
