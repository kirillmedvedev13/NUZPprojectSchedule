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
    id_class: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_group: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_audience: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    });
    Schedule.associate = (models) => {
        Schedule.belongsTo(models.day_week, { foreignKey: "id_day_week",});
        Schedule.belongsTo(models.pair_type, { foreignKey: "id_pair_type",});
        Schedule.belongsTo(models.class, { foreignKey: "id_class",});
        Schedule.belongsTo(models.group, { foreignKey: "id_group",});
        Schedule.belongsTo(models.audience, { foreignKey: "id_audience",});
    };
    return Schedule;
  };
  