export default (Sequelize, DataTypes) => {
    const Type_class = Sequelize.define("type_class", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },

    });
  
    Type_class.associate = (models) => {
      Type_class.hasMany(models.audience, {
        foreignKey: "id_type_class",
      });
    };
  
    return Type_class;
  };
  