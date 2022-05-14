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
    population_size: {
      type: DataTypes.INTEGER,
    },
    max_generations: {
      type: DataTypes.INTEGER,
    },
    p_crossover: {
      type: DataTypes.DOUBLE,
    },
    p_mutation: {
      type: DataTypes.DOUBLE,
    },
    p_genes: {
      type: DataTypes.DOUBLE,
    },
    penaltyGrWin: {
      type: DataTypes.DOUBLE,
    },
    penaltyTeachWin: {
      type: DataTypes.DOUBLE,
    },
    penaltyLateSc: {
      type: DataTypes.DOUBLE,
    },
    penaltyEqSc: {
      type: DataTypes.DOUBLE,
    },
    penaltySameTimesSc: {
      type: DataTypes.DOUBLE,
    },
    p_elitism: {
      type: DataTypes.DOUBLE,
    },
  });

  return Info;
};
