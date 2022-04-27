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
    });
    
    return Info;
  };
  