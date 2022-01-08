export default (Sequelize, DataTypes) => {
    const Classes = Sequelize.define("classes", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      times_per_week: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      id_discipline: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    };
    return Classes;
  };
  