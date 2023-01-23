export default (Sequelize, DataTypes) => {
  const Info = Sequelize.define("info", {
    max_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_pair: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fitness_value: {
      type: DataTypes.STRING(500),
    },
    general_values: {
      type: DataTypes.STRING(500),
    },
  });

  return Info;
};
