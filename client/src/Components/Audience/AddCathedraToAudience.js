import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CATHEDRA_TO_AUDIENCE } from "./mutations";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import ValidatedMessage from "../ValidatedMessage";

export default function AddCathedraToAudience({
  item,
  handleChangeItem,
  statusAddCathedraToAudience,
  selectedCathedraToAdd,
  validatedSelectedCathedraToAdd,
  handleChangeState,
  handleIncCounter,
  counterCathedras,
}) {
  const query = useQuery(GET_ALL_CATHEDRAS);
  const [AddCathedraToAudience, { loading, error }] = useMutation(
    ADD_CATHEDRA_TO_AUDIENCE
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllCathedras.forEach((element) => {
    options.push({ label: element.name, value: +element.id });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddCathedraToAudience) {
    // Если открыт селект
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть кафедру</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Кафедра"
            defaultValue={{ label: selectedCathedraToAdd?.name, value: +selectedCathedraToAdd?.id }}
            onChange={(e) => {
              handleChangeState(
                "selectedCathedraToAdd",
                query.data.GetAllCathedras.find((c) => +c.id === +e.value)
              );
              handleChangeState("validatedSelectedCathedraToAdd", {
                status: true,
                message: "",
              });
            }}
          ></Select>
          {!validatedSelectedCathedraToAdd.status && (
            <ValidatedMessage
              message={validatedSelectedCathedraToAdd.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedCathedraToAdd) {
                const checkSelectedCathedras = item.assigned_audiences.find(
                  (au) => +au.cathedra.id === +selectedCathedraToAdd.id
                );
                if (!checkSelectedCathedras) {
                  // Проверка не добавлена ли эта кафедра уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddCathedraToAudience({
                      variables: {
                        id_cathedra: +selectedCathedraToAdd.id,
                        id_audience: +item.id,
                      },
                    }).then((res) => {
                      const au = JSON.parse(
                        res.data.AddCathedraToAudience.data
                      );
                      handleChangeItem("assigned_audiences", [
                        ...item.assigned_audiences,
                        {
                          id: au.id,
                          cathedra: selectedCathedraToAdd,
                        },
                      ]);
                      CreateNotification(res.data.AddCathedraToAudience);
                    });
                  } else {
                    // Создание элемента
                    let arrAU = item.assigned_audiences;
                    arrAU.push({
                      id: counterCathedras,
                      cathedra: selectedCathedraToAdd,
                    });
                    handleChangeItem("assigned_audiences", arrAU);
                    handleIncCounter("counterCathedras");
                  }
                } else {
                  handleChangeState("validatedSelectedCathedraToAdd", {
                    status: false,
                    message: "Кафедра вже додана",
                  });
                }
              } else {
                handleChangeState("validatedSelectedCathedraToAdd", {
                  status: false,
                  message: "Кафедра не вибрана!",
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
        onClick={(e) => handleChangeState("statusAddCathedraToAudience", true)}
      >
        Додати кафедру
      </Button>
    );
  }
}
