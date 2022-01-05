export default (Sequelize, DataTypes) => {
  return Sequelize.define("teachers", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });
};;
