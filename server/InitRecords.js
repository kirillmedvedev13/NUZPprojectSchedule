export default async function InitRecords(db) {
  await db.type_class.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: "Лекція",
    },
  });
  await db.type_class.findOrCreate({
    where: { id: 2 },
    defaults: {
      name: "Практика",
    },
  });
  await db.algorithm.findOrCreate({
    where: { name: "evolution_algorithm" },
    defaults: {
      name: "evolution_algorithm",
      label: "Генетичний алгоритм",
      params: JSON.stringify([
        {
          name: "population_size",
          label: "Розмір популяції",
          value: 300,
        },
        {
          name: "max_generations",
          label: "Максимальна кiлькiсть iтерацiй",
          value: 300,
        },
        {
          name: "p_crossover",
          label: "Ймовірність схрещування",
          value: 0.5,
        },
        {
          name: "p_mutation",
          label: "Ймовірність мутації",
          value: 0.5,
        },
        {
          name: "p_genes",
          label: "Ймовірність мутації гена",
          value: 0.01,
        },
        {
          name: "p_elitism",
          label: "Елітизм",
          value: 0.15,
        },
      ]),
      results: JSON.stringify([]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "evolution_algorithmCPP" },
    defaults: {
      name: "evolution_algorithmCPP",
      label: "Генетичний алгоритм на С++",
      params: JSON.stringify([
        {
          name: "population_size",
          label: "Розмір популяції",
          value: 300,
        },
        {
          name: "max_generations",
          label: "Максимальна кiлькiсть iтерацiй",
          value: 300,
        },
        {
          name: "p_crossover",
          label: "Ймовірність схрещування",
          value: 0.5,
        },
        {
          name: "p_mutation",
          label: "Ймовірність мутації",
          value: 0.5,
        },
        {
          name: "p_genes",
          label: "Ймовірність мутації гена",
          value: 0.01,
        },
        {
          name: "p_elitism",
          label: "Елітизм",
          value: 0.15,
        },
      ]),
      results: JSON.stringify([]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "simple_algorithm" },
    defaults: {
      name: "simple_algorithm",
      label: "Алгоритм простого перебору",
      params: JSON.stringify([]),
      results: JSON.stringify([]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "simulated_annealing_algorithm" },
    defaults: {
      name: "simulated_annealing_algorithm",
      label: "Алгоритм імітації відпалу",
      params: JSON.stringify([
        {
          name: "temparature",
          label: "Початкова температура",
          value: 100,
        },
        {
          name: "alpha",
          label: "Коефіцієнт alpha",
          value: 0.99,
        },
      ]),
      results: JSON.stringify([]),
    },
  });

  await db.info.findOrCreate({
    where: { id: 1 },
    defaults: {
      max_day: 6,
      max_pair: 6,
      max_semester: 17,
      fitness_value: JSON.stringify({
        fitnessValue: 0,
        fitnessGr: {
          fitnessGrWin: 0,
          fitnessSameTimesSc: 0,
          fitnessValue: 0,
        },
        fitnessTeach: {
          fitnessTeachWin: 0,
          fitnessSameTimesSc: 0,
          fitnessValue: 0,
        },
        fitnessAud: { fitnessSameTimesSc: 0, fitnessValue: 0 },
        fitnessSameRecSc: 0,
      }),
      general_values: JSON.stringify({
        penaltyGrWin: 0,
        penaltyTeachWin: 0,
        penaltyLateSc: 0,
        penaltyEqSc: 0,
        penaltySameTimesSc: 0,
        penaltySameRecSc: 0,
      }),
    },
  });

  await db.user.findOrCreate({
    where: { id: 1 },
    defaults: {
      email: "admin@nuzp.com",
      password: "admin",
    },
  });
}
