// должен иметь 3 элемента tableinfo searchinfo mutations
tableinfo = {
    rows: [
        { //Массив элементов для заголовка
            headname: "Назва спеціалізації", //Названия заголовка в таблице
            nameatr: "name", //названия отображаемого атрибута в запросе из бд
        },
    ],
    query: { //Параметры запроса в graphql
        name: "GetAllSpecialties",
        gql: GetAllSpecialties, //запрос в gql формате
    }
}
const searchinfo = [
    { // Массив для фильтрации данных таблицы 
        type: "input", // в зависимости от типа отображается соответственый фильтр
        namefilter: "name", //названия поля в сотоянии компонента 
        typeValue: String, // тип данных для этого фильтра (дял корректной отправки данных в бд)
        placeholder: "Спеціальність", 
    },
    {
        type: "select",
        namefilter: "id_cathedra",
        typeValue: Number,
        placeholder: "Кафедра",
        query: { // Нужен для отправи запроса в бд
            name: "GetAllCathedras",
            gql: GetAllCathedras,
            nameatr: "name", // имя атрибута из запроса для поля label в выпадающем списке
        }
    }
]

const mutations = {// все мутации в gql формате
    create: CreateSpecialty,
    update: UpdateSpecialty,
    delete: DeleteSpecialty,
}