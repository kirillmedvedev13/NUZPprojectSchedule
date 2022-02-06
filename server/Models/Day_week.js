export default (Sequelize, DataTypes) => {
  const Day_week = Sequelize.define("day_week", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
  });
  Day_week.associate = (models) => {
    Day_week.hasMany(models.schedule, {foreignKey: "id_day_week", });
  };
  return Day_week;
};
