export default (Sequelize, DataTypes) => {
  const Audience = Sequelize.define("audience", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    id_type_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
  });

  Audience.associate = (models) => {
    Audience.hasMany(models.recommended_audience, {
      foreignKey: "id_audience",
    });
    Audience.belongsToMany(models.class, {
      foreignKey: "id_audience",
      through: models.recommended_audience,
    });
    Audience.hasMany(models.assigned_audience, {
      foreignKey: "id_audience",
    });
    Audience.belongsTo(models.type_class, {
      foreignKey: "id_type_class",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Audience.belongsToMany(models.cathedra, {
      foreignKey: "id_audience",
      through: models.assigned_audience,
    });
    Audience.hasMany(models.schedule, { foreignKey: "id_audience" });
  };

  return Audience;
};
