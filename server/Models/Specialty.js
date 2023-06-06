export default (Sequelize, DataTypes) => {
  const Specialty = Sequelize.define("specialty", {
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
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cathedra: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Specialty.associate = (models) => {
    Specialty.belongsTo(models.cathedra, {
      foreignKey: "id_cathedra",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Specialty.hasMany(models.assigned_discipline, {
      foreignKey: "id_specialty",
    });
  };
  return Specialty;
};
