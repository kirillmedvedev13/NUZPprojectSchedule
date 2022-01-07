export default (Sequelize, DataTypes) => {
  const Specialty = Sequelize.define("specialty", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
  return Specialty;
};
