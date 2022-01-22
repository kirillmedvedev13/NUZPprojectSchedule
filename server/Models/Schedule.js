export default (Sequelize, DataTypes) => {
  const Schedule = Sequelize.define("schedule", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    number_pair: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_day_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pair_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_assigned_group: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_audience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Schedule.associate = (models) => {
    Schedule.belongsTo(models.day_week, { foreignKey: "id_day_week" });
    Schedule.belongsTo(models.pair_type, { foreignKey: "id_pair_type" });
    Schedule.belongsTo(models.audience, { foreignKey: "id_audience" });
    Schedule.belongsTo(models.assigned_group, {
      foreignKey: "id_assigned_group",
    });
  };
  return Schedule;
};
