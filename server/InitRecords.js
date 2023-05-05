export default async function InitRecords(db) {

  let initialization_options = [
    { value: "random", label: "Випадкова ініціалізація" },
    { value: "simple_algorithm", label: "Ініціалізація за допомогою просто перебору" },
  ];
  let selection_options = [
    { value: "ranging", label: "Відбір ранжуванням" },
    { value: "roulette", label: "Відбір рулектою" },
    { value: "tournament", label: "Відбір турніром" },
  ];
  let bool_options = [
    { value: false, label: "Не застосовувати" },
    { value: true, label: "Застосовувати" },
  ];
  let crossing_options = [
    { value: "custom_one_gene", label: "Схрещування одного гену" },
    { value: "k_point", label: "Схрещування k точок" },
  ];
  let mutation_options = [
    { value: "custom_one_gene", label: "Мутація одного гену" },
    { value: "all_genes", label: "Мутація всіх генів" },
  ];
  

  let EAparamsCPP = [
    {
      name: "population_size",
      label: "Розмір популяції",
      short: "Роз.поп.",
      type: "number",
      min: 1,
      max: null,
      step: 50,
      value: 300,
    },
    {
      name: "max_generations",
      label: "Максимальна кiлькiсть iтерацiй",
      short: "ітер.",
      type: "number",
      min: 1,
      max: null,
      step: 50,
      value: 300,
    },
    {
      name: "p_crossover",
      label: "Ймовірність схрещування",
      short: "схрещ.",
      type: "number",
      min: 0,
      max: 1,
      step: 0.05,
      value: 0.5,
    },
    {
      name: "p_mutation",
      label: "Ймовірність мутації індивіда",
      short: "мут.інд.",
      min: 0,
      max: 1,
      type: "number",
      step: 0.05,
      value: 0.5,
    },
    {
      name: "p_elitism",
      label: "Елітизм",
      short: "еліт.",
      min: 0,
      max: 0.5,
      type: "number",
      step: 0.01,
      value: 0.1,
    },
    {
      name: "type_initialization",
      label: "Тип ініціалізації індивідів",
      short: "тип ініц.",
      type: "select",
      value: initialization_options[0].value,
      options: initialization_options,
    },
    {
      name: "type_selection",
      label: "Тип відбору індивідів",
      short: "тип відб.",
      type: "select",
      value: selection_options[0].value,
      options: selection_options,
    },
    {
      name: "fitness_scaling",
      label: "Масштабування фітнес значення до [30-80]",
      short: "масшт.",
      type: "select",
      value: bool_options[0].value,
      options: bool_options,
    },
    {
      name: "type_crossing",
      label: "Тип схрещування",
      short: "тип схрещ.",
      type: "select",
      value: crossing_options[0].value,
      options: crossing_options,
    },
    {
      name: "num_k_point",
      label: "Кількість k точок схрещювання (тільки якщо обрано схрещювання k точок)",
      short: "k.точок",
      type: "number",
      value: 2,
      min: 1,
      max: 10,
      step: 1,
    },
    {
      name: "type_mutation",
      label: "Тип мутації",
      short: "тип мут.",
      type: "select",
      value: mutation_options[0].value,
      options: mutation_options,
    },
    {
      name: "p_mutation_gene",
      label: "Ймовірність мутації гена (тільки якщо обрано мутацію - всіх генів)",
      short: "мут.ген.",
      type: "number",
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.05,
    },
  ];


  let EAparamsCPPIsland = [
    ...EAparamsCPP,
    {
      name: "number_islands",
      label: "Кількість островів",
      short: "кіл.ост.",
      min: 1,
      max: null,
      type: "number",
      step: 1,
      value: 5,
    },
    {
      name: "step",
      label: "Крок розбіжності значень y % (на скільки будуть збільшуватися параметри у наступних отсровах)",
      short: "кр.",
      min: 1,
      max: 100,
      type: "number",
      step: 0.5,
      value: 2,
    },
    {
      name: "iter_migration",
      label: "Період міграції (кількість ітерацій)",
      short: "пер.мігр.",
      min: 1,
      max: null,
      type: "number",
      step: 1,
      value: 10,
    },
    {
      name: "n_migration",
      label: "Кількість індивідів для участі в міграції",
      short: "кільк.мігр.",
      min: 0,
      max: 1,
      type: "number",
      step: 0.01,
      value: 0.2,
    },
  ];

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
    where: { name: "model_lstm" },
    defaults: {
      name: "model_lstm",
      label: "Модель на основі LSTM",
      params: JSON.stringify([]),
      results: JSON.stringify([[0, 0]]),
    },
  });

  await db.algorithm.findOrCreate({
    where: { name: "evolution_algorithmCPP" },
    defaults: {
      name: "evolution_algorithmCPP",
      label: "Генетичний алгоритм на С++",
      params: JSON.stringify(EAparamsCPP),
      results: JSON.stringify([[0, 0]]),
    },
  });
  await db.algorithm.findOrCreate({
    where: { name: "island_model_evolution_algorithmCPP" },
    defaults: {
      name: "island_model_evolution_algorithmCPP",
      label: "Острівна модель генетичного алгоритму на С++",
      params: JSON.stringify(EAparamsCPPIsland),
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
          short: "дія т.",
          min: 0,
          max: null,
          type: "number",
          step: 1,
          value: 10,
        },

        {
          name: "s_neighbors",
          label: "Кількість сусідніх розв’язків на 1 ітерації",
          short: "сусід.",
          min: 1,
          max: null,
          type: "number",
          step: 1,
          value: 10,
        },
        {
          name: "n_iteration",
          label: "Кількість ітерації",
          short: "ітер.",
          min: 1,
          max: null,
          type: "number",
          step: 1,
          value: 10000,
        },
        {
          name: "tabu_list_len",
          label: "Довжина списку Табу",
          short: "довж.т.",
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
          short: "темп.",
          min: 0,
          max: null,
          step: 0.1,
          type: "number",
          value: 100,
        },
        {
          name: "alpha",
          label: "Коефіцієнт alpha",
          short: "alpha",
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
        penaltyGrWin: 1,
        penaltyTeachWin: 1,
        penaltyLateSc: 2,
        penaltyEqSc: 2,
        penaltySameTimesSc: 5,
        penaltySameRecSc: 5,
      }),
    },
  });

  await db.user.findOrCreate({
    where: { id: 1 },
    defaults: {
      email: "admin1@nuzp.com",
      password: "admin",
    },
  });

  await db.user.findOrCreate({
    where: { id: 2 },
    defaults: {
      email: "admin2@nuzp.com",
      password: "admin",
    },
  });
}