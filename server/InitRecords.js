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
          type: "number",
          min: 1,
          max: null,
          step: 50,
          value: 300,
        },
        {
          name: "max_generations",
          label: "Максимальна кiлькiсть iтерацiй",
          type: "number",
          min: 1,
          max: null,
          step: 50,
          value: 300,
        },
        {
          name: "p_crossover",
          label: "Ймовірність схрещування",
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
          value: 0.5,
        },
        {
          name: "p_mutation",
          label: "Ймовірність мутації",
          min: 0,
          max: 1,
          type: "number",
          step: 0.05,
          value: 0.5,
        },
        {
          name: "p_genes",
          label: "Ймовірність мутації гена",
          min: 0,
          max: 1,
          type: "number",
          step: 0.001,
          value: 0.01,
        },
        {
          name: "p_elitism",
          label: "Елітизм",
          min: 0,
          max: 0.5,
          type: "number",
          step: 0.01,
          value: 0.1,
        },
      ]),
      results: JSON.stringify([[0, 0]]),
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
          type: "number",
          min: 1,
          max: null,
          step: 1,
          value: 300,
        },
        {
          name: "max_generations",
          label: "Максимальна кiлькiсть iтерацiй",
          type: "number",
          min: 1,
          max: null,
          step: 1,
          value: 300,
        },
        {
          name: "p_crossover",
          label: "Ймовірність схрещування",
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
          value: 0.5,
        },
        {
          name: "p_mutation",
          label: "Ймовірність мутації",
          min: 0,
          max: 1,
          type: "number",
          step: 0.05,
          value: 0.5,
        },
        {
          name: "p_genes",
          label: "Ймовірність мутації гена",
          min: 0,
          max: 1,
          type: "number",
          step: 0.001,
          value: 0.01,
        },
        {
          name: "p_elitism",
          label: "Елітизм",
          min: 0,
          max: 0.5,
          type: "number",
          step: 0.01,
          value: 0.1,
        },
      ]),
      results: JSON.stringify([[0, 0]]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "simple_algorithm" },
    defaults: {
      name: "simple_algorithm",
      label: "Алгоритм простого перебору",
      params: JSON.stringify([]),
      results: JSON.stringify([[0, 0]]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "tabu_search_algorithm" },
    defaults: {
      name: "tabu_search_algorithm",
      label: "Алгоритм Табу-пошуку",
      params: JSON.stringify([
        {
          name: "tabu_tenure",
          label: "Кількість ітерації дії Табу",
          min: 0,
          max: null,
          type: "number",
          step: 1,
          value: 10,
        },

        {
          name: "s_neighbors",
          label: "Кількість сусідніх розв’язків на 1 ітерації",
          min: 1,
          max: null,
          type: "number",
          step: 1,
          value: 10,
        },
        {
          name: "n_iteration",
          label: "Кількість ітерації",
          min: 1,
          max: null,
          type: "number",
          step: 1,
          value: 10000,
        },
        {
          name: "tabu_list_len",
          label: "Довжина списку Табу",
          min: 1,
          max: null,
          type: "number",
          step: 1,
          value: 50,
        },
      ]),
      results: JSON.stringify([[0, 0]]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "simulated_annealing_algorithm" },
    defaults: {
      name: "simulated_annealing_algorithm",
      label: "Алгоритм імітації відпалу",
      params: JSON.stringify([
        {
          name: "temperature",
          label: "Початкова температура",
          min: 0,
          max: null,
          step: 0.1,
          type: "number",
          value: 100,
        },
        {
          name: "alpha",
          label: "Коефіцієнт alpha",
          min: 0,
          max: 1,
          step: 0.01,
          type: "number",
          value: 0.99,
        },
      ]),
      results: JSON.stringify([[0, 0]]),
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
