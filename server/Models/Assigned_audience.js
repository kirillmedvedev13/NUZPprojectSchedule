export default (Sequelize, DataTypes) => {
    return Sequelize.define("assigned_audience", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_audience: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_cathedra: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  };;
  