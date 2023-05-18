export default (Sequelize, DataTypes) => {
  const Recommended_schedule = Sequelize.define("recommended_schedule", {
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
    day_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Recommended_schedule.associate = (models) => {
    Recommended_schedule.belongsTo(models.class, {
      foreignKey: "id_class",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Recommended_schedule;
};
