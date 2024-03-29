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
      unique: false,
    },
    id_discipline: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Assigned_discipline.associate = (models) => {
    Assigned_discipline.belongsTo(models.specialty, {
      foreignKey: "id_specialty",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Assigned_discipline.belongsTo(models.discipline, {
      foreignKey: "id_discipline",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Assigned_discipline.hasMany(models.class, {
      foreignKey: "id_assigned_discipline",
    });
  };

  return Assigned_discipline;
};
