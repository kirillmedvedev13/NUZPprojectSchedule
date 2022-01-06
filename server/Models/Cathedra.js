export default (Sequelize, DataTypes) => {
  let Cathedra =  Sequelize.define("cathedra", {
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

  Cathedra.associate = models => {
    Cathedra.belongsToMany(models.audience, 
      {
         through: models.assigned_audience,
         foreignKey: 'id_cathedra'
    });
  }
  return Cathedra;
};
