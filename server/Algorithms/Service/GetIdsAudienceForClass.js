import GetRndInteger from "./GetRndInteger.js";

export default function GetIdsAudienceForClass(clas, audiences) {
  // Если есть рекоменд аудитории, то выбирается случайная без доп условий
  if (clas.recommended_audiences?.length) {
    let arr = [];
    clas.recommended_audiences.forEach((ra) => {
      arr.push(ra.id_audience);
    });
    return arr;
  }
  // Если нету рек аудиторий, то ищется свободная среди кафедр и по типу, если такая не найденна, то выбирается случайная среди всех по типу
  // И проводится доп проверка на ёмкость групп и аудитории для занятия
  else {
    let sum_students = 0;
    clas.assigned_groups.forEach((ag) => {
      sum_students += ag.group.number_students;
    });
    const id_cathedra = clas.assigned_discipline.specialty.id_cathedra;
    let detected_audiences = [];
    // Поиск аудиторий у которых закреплены нужные кафедры
    detected_audiences = audiences.filter((aud) => {
      // Если аудитория подходит по ёмкости и типу
      if (
        aud.capacity >= sum_students &&
        aud.id_type_class === clas.id_type_class
      ) {
        let isSuitableAudience = aud.assigned_audiences.find(
          (au) => au.id_cathedra === id_cathedra
        );
        if (isSuitableAudience) return true;
        else return false;
      }
      // Если аудитория не подходит по ёмкости и типу
      return false;
    });
    // Если в списке всех аудиторий нашлась хоть одна подходящяя с кафедрой, типом и ёмкостью, то возвращаем её ид
    if (detected_audiences.length) {
      let arr = [];
      detected_audiences.forEach((da) => {
        arr.push(da.id_audience);
      });
      return arr;
    }
    // Если не найдена ни одна адутитория за кафедрой, то выбираем случайную из всех по типу и ёмкости
    else {
      detected_audiences = audiences.filter((aud) => {
        if (
          aud.id_type_class === clas.id_type_class &&
          aud.capacity >= sum_students
        ) {
          return true;
        }
      });
      if (!detected_audiences.length) {
        throw { successful: false, message: "Не знайдено жодної аудиторії" };
      }
      return [
        detected_audiences[GetRndInteger(0, detected_audiences.length - 1)]
          .id_audience,
      ];
    }
  }
}
