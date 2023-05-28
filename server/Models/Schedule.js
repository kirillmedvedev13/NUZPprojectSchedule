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
    day_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pair_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_audience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Schedule.associate = (models) => {
    Schedule.belongsTo(models.audience, {
      foreignKey: "id_audience",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Schedule.belongsTo(models.class, {
      foreignKey: "id_class",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Schedule;
};
