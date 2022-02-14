import { GraphQLString, GraphQLInt } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const SET_CLASSES = {
    type: MessageType,
    args: {
        data: { type: GraphQLString },
        id_cathedra: { type: GraphQLInt }
    },
    async resolve(parent, { data, id_cathedra }) {
        const classes = JSON.parse(data).classes;
        const disciplines = await db.discipline.findAll({
            include: {
                model: db.assigned_discipline,
                required: true,
                include: {
                    model: db.specialty,
                    required: true,
                    include: {
                        model: db.cathedra,
                        required: true,
                    }
                }
            }
        })
        let specialties = await db.specialty.findAll({})
        const teachers = await db.teacher.findAll();
        const groups = await db.group.findAll({
            include: {
                model: db.specialty,
                required: true,
            }
        });
        const audiences = await db.audience.findAll({
            include: {
                model: db.assigned_audience,
                required: true,
                include: {
                    model: db.cathedra,
                    required: true,
                }
            }
        })
        for (const clas of classes) {
            const code_spec = Number(clas.groups[0].charAt(0)); // первая цифра первой группы это код специальности
            const arr_disc = disciplines.filter(disc => disc.name === clas.discipline
                && disc.assigned_discipline.specialty.code === code_spec
                && disc.assigned_discipline.specialty.id_cathedra === id_cathedra);
            let id_assigned_discipline = null;
            if (arr_disc.length) { // Если найдена в базе дисциплина за специальностью
                id_assigned_discipline = arr_disc[0].assigned_discipline.id;
            }
            else {
                const arr_spec = specialties.filter(spec => spec.code === code_spec && spec.id_cathedra === id_cathedra);
                console.log("lenght")
                console.log(specialties)
                let id_spec = null;
                if (arr_spec.length) { //Если найдена в базе специальность за кафедрой
                    id_spec = arr_spec[0].id;
                }
                else { // Специальность не найденна, её нужно создать
                    const new_spec = await db.specialty.create({ name: "", id_cathedra, code: code_spec });
                    specialties.push(new_spec);
                }
            }
        }
        const res = true;
        return res
            ? { successful: true, message: "Данi завантаженi успiшно" }
            : { successful: false, message: "Помилка при завантаженi даних" };
    }
};