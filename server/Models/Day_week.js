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
  return Day_week;
};
