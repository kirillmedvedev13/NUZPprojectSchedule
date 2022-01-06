export default (Sequelize, DataTypes) => {
    let Audience = Sequelize.define("audience", {
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

    Audience.associate = models => {
      Audience.belongsToMany(models.cathedra, 
        {
           through: models.assigned_audience,
           foreignKey: 'id_audience'
      });
    }

    return Audience;
  };

