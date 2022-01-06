export default (Sequelize, DataTypes) => {
    return Sequelize.define("audiences", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      audience_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      capacity: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    });
  };;
  