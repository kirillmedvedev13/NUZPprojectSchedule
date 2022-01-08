export default (Sequelize, DataTypes) => {
    const Discipline = Sequelize.define("discipline", {
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
      id_specialty:{
        type: DataTypes.INTEGER,
        allowNull: false,        
      }
    });
    
    Discipline.associate = (models) => {
        Discipline.belongsTo(models.specialty, {
        foreignKey: "id_specialty",
      });
    };
    return Discipline;
  };
  