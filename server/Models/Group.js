export default (Sequelize, DataTypes) => {
    const Group = Sequelize.define("group", {
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
      number_students: {
        type: DataTypes.INTEGER,
        allowNullL: false,
      },
      id_specialty:{
        type: DataTypes.INTEGER,
        allowNull: false,        
      }
    });
    Group.associate = (models) => {
        Group.belongsTo(models.specialty, {foreignKey: "id_specialty",});
        Group.hasMany(models.schedule, {foreignKey: "id_group",});
    };
    return Group;
  };
  