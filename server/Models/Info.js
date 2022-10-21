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
    max_semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fitness_value: {
      type: DataTypes.STRING(500),
    },
    general_values: {
      type: DataTypes.STRING(500),
    },
    evolution_values: {
      type: DataTypes.STRING(500),
    },
    simulated_annealing: {
      type: DataTypes.STRING(500),
    },
    results: {
      type: DataTypes.TEXT('long')
    }
    // {"penaltyGrWin":2,"penaltyTeachWin":2,"penaltyLateSc":2,"penaltyEqSc":2,"penaltySameTimesSc":2,"penaltySameRecSc":5}
    // {"population_size":300,"max_generations":400,"p_crossover":0.5,"p_mutation":0.3,"p_genes":0.1,"p_elitism":0.4}
    // {"alpha" : 0.95, "temperature" : 100}
  });

  return Info;
};
