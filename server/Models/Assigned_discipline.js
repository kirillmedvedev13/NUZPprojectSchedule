export default (Sequelize, DataTypes) => {
    const Assigned_discipline = Sequelize.define("assigned_discipline", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_specialty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_discipline: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    Assigned_discipline.associate = (models) => {
    //   Assigned_audience.belongsTo(models.cathedra, {
    //     foreignKey: "id_cathedra",
    //   });
    //   Assigned_audience.belongsTo(models.audience, {
    //     foreignKey: "id_audience",
    //   });
    };
  
    return Assigned_discipline;
  };
  