export default (Sequelize, DataTypes) => {
  const Assigned_audience = Sequelize.define("assigned_audience", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_audience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cathedra: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Assigned_audience;
};
