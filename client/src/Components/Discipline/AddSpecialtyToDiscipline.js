import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_DISCIPLINE_TO_SPECIALTY } from "./mutations";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import ValidatedMessage from "../ValidatedMessage";

export default function AddSpecialtyToDiscipline({
  item,
  handleChangeItem,
  statusAddDisciplineToSpecialty,
  selectedSpecialtyToAdd,
  validatedSelectedSpecialtyToAdd,
  handleChangeState,
  handleIncCounter,
  counterSpecialties,
}) {
  const query = useQuery(GET_ALL_SPECIALTIES);
  const [AddDiscToSpecialty, { loading, error }] = useMutation(
    ADD_DISCIPLINE_TO_SPECIALTY
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllSpecialties.forEach((element) => {
    options.push({ label: element.name, value: +element.id });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddDisciplineToSpecialty) {
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">
          Виберiть спеціальність
        </Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Спеціальність"
            onChange={(e) => {
              handleChangeState(
                "selectedSpecialtyToAdd",
                query.data.GetAllSpecialties.find((s) => +s.id === +e.value)
              );
              handleChangeState("validatedSelectedSpecialtyToAdd", {
                status: true,
                message: "",
              });
            }}
          ></Select>
          {!validatedSelectedSpecialtyToAdd.status && (
            <ValidatedMessage
              message={validatedSelectedSpecialtyToAdd.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col>
          <Form.Control
            required
            type="number"
            min="1"
            max="13"
            placeholder="Семестр"
            onChange={(e) => {
              handleChangeState(
                "selectedSpecialtyToAdd",
                query.data.GetAllSpecialties.find((s) => +s.id === +e.value)
              );
              handleChangeState("selectedSpecialtyToAdd", {
                id: selectedSpecialtyToAdd ? selectedSpecialtyToAdd.id : 0,
                name: selectedSpecialtyToAdd
                  ? selectedSpecialtyToAdd.name
                  : null,
                semester: e.target.value,
              });
              handleChangeState("validatedSelectedSpecialtyToAdd", {
                status: true,
                message: "",
              });
            }}
          ></Form.Control>
          {!validatedSelectedSpecialtyToAdd.status && (
            <ValidatedMessage
              message={validatedSelectedSpecialtyToAdd.message}
            ></ValidatedMessage>
          )}
        </Col>

        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedSpecialtyToAdd) {
                if (
                  selectedSpecialtyToAdd.name &&
                  selectedSpecialtyToAdd.semester
                ) {
                  const checkSelectedSpecialties =
                    item.assigned_disciplines.filter(
                      (disc) =>
                        +disc.specialty.id === +selectedSpecialtyToAdd.id &&
                        +disc.semester === +selectedSpecialtyToAdd.semester
                    );
                  if (!checkSelectedSpecialties.length) {
                    // Проверка не добавлена ли эта кафедра уже в массив
                    if (item.id) {
                      // Если редактирование элемента
                      AddDiscToSpecialty({
                        variables: {
                          id_specialty: +selectedSpecialtyToAdd.id,
                          semester: +selectedSpecialtyToAdd.semester,
                          id_discipline: +item.id,
                        },
                      }).then((res) => {
                        debugger;
                        const ad = JSON.parse(
                          res.data.AddDisciplineToSpecialty.data
                        );

                        handleChangeItem("assigned_disciplines", [
                          ...item.assigned_disciplines,
                          {
                            id: ad.id,
                            specialty: selectedSpecialtyToAdd,
                            semester: ad.semester,
                          },
                        ]);
                        CreateNotification(res.data.AddDisciplineToSpecialty);
                      });
                    } else {
                      // Создание элемента
                      let arrAD = item.assigned_disciplines;
                      arrAD.push({
                        id: counterSpecialties,
                        semester: selectedSpecialtyToAdd.semester,
                        specialty: {
                          id: selectedSpecialtyToAdd.id,
                          name: selectedSpecialtyToAdd.name,
                        },
                      });
                      handleChangeItem("assigned_disciplines", arrAD);
                      handleIncCounter("counterSpecialties");
                    }
                  } else {
                    handleChangeState("validatedSelectedSpecialtyToAdd", {
                      status: false,
                      message: "Не можна додати однакових записів",
                    });
                  }
                } else {
                  handleChangeState("validatedSelectedSpecialtyToAdd", {
                    status: false,
                    message: "Виберіть спеціальність та вкажіть семестр!",
                  });
                }
              } else {
                handleChangeState("validatedSelectedSpecialtyToAdd", {
                  status: false,
                  message: "Спеціальність не вибрана!",
                });
              }
            }}
          >
            Зберегти
          </Button>
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <Button
        onClick={(e) =>
          handleChangeState("statusAddDisciplineToSpecialty", true)
        }
      >
        Додати Спеціальність
      </Button>
    );
  }
}
