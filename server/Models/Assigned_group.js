export default (Sequelize, DataTypes) => {
  const Assigned_group = Sequelize.define("assigned_group", {
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
    id_group: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Assigned_group.associate = (models) => {
    Assigned_group.belongsTo(models.group, {
      foreignKey: "id_group",
      onDelete: "cascade"
    });
    Assigned_group.belongsTo(models.class, {
      foreignKey: "id_class",
      onDelete: "cascade"
    });
    Assigned_group.hasMany(models.schedule, {
      foreignKey: "id_assigned_group",
    });
  };

  return Assigned_group;
};
