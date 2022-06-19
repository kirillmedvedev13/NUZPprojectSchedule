import { XCircle } from "react-bootstrap-icons";
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_RECOMMENDED_SCHEDULE_TO_CLASS,
  DELETE_RECOMMENDED_SCHEDULE_FROM_CLASS,
} from "./mutations";
import { GET_INFO } from "../Schedule/queries";
import ValidatedMessage from "../ValidatedMessage";
import GetDayWeek from "./GetDayWeek";

export function TableRecSchedule({ item, handleChangeItem }) {
  const [DelRecScheduleFromClass, { loading, error }] = useMutation(
    DELETE_RECOMMENDED_SCHEDULE_FROM_CLASS
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>День тижня</th>
          <th>Номер пари</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.recommended_schedules.map((itemRS) => (
          <tr key={Number(itemRS.id)}>
            <td>{GetDayWeek(itemRS.day_week)}</td>
            <td>{itemRS.number_pair}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelRecScheduleFromClass({
                      variables: { id: Number(itemRS.id) },
                    }).then((res) => {
                      if (res.data.DeleteRecScheduleFromClass.successful) {
                        const arr_rs = item.recommended_schedules.filter(
                          (rs) => +rs.id !== +itemRS.id
                        );
                        handleChangeItem("recommended_schedules", arr_rs);
                      }
                      CreateNotification(res.data.DeleteRecScheduleFromClass);
                    });
                  } else {
                    // При добавлении
                    let arrRS = item.recommended_schedules.filter(
                      (rs) => Number(rs.id) !== Number(itemRS.id)
                    );
                    handleChangeItem("recommended_schedules", arrRS);
                  }
                }}
              ></XCircle>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function AddRecScheduleToClass({
  item,
  handleChangeItem,
  statusAddRecScheduleToClass,
  counterRecSchedules,
  validatedRecDayWeek,
  validatedRecNumberPair,
  selectedRecDayWeek,
  selectedRecNumberPair,
  handleChangeState,
  handleIncCounter,
}) {
  const query = useQuery(GET_INFO);
  const [AddRecScheduleToClass, { loading, error }] = useMutation(
    ADD_RECOMMENDED_SCHEDULE_TO_CLASS
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  for (let i = 0; i < query.data.GetInfo.max_day; i++) {
    options.push({ label: GetDayWeek(i + 1), value: i + 1 });
  }

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddRecScheduleToClass) {
    // Если открыт селект
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть час</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="День тижня"
            onChange={(e) => {
              handleChangeState("selectedRecDayWeek", +e.value);
              handleChangeState("validatedRecDayWeek", {
                status: true,
              });
            }}
          ></Select>
          {!validatedRecDayWeek.status && (
            <ValidatedMessage
              message={validatedRecDayWeek.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="px-1">
          <Form.Control
            type="number"
            placeholder="Номер пари"
            onChange={(e) => {
              if (+e.target.value >= 1 && +e.target.value <= +query.data.GetInfo.max_pair && Number.isInteger(+e.target.value)) {
                handleChangeState("selectedRecNumberPair", +e.target.value);
                handleChangeState("validatedRecNumberPair", { status: true });
              }
              else {
                e.target.value = selectedRecNumberPair;
                handleChangeState("validatedRecNumberPair", { status: false, message: `Номер пари повинен бути у проміжку [1-${query.data.GetInfo.max_pair}] та цілочисельний` });
              }
            }}
          ></Form.Control>
          {!validatedRecNumberPair.status && (
            <ValidatedMessage
              message={validatedRecNumberPair.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedRecDayWeek && selectedRecNumberPair) {
                //Если полe в селекте не пустое
                const checkSelectedRecSchedule =
                  item.recommended_schedules.find(
                    (obj) =>
                      +obj.day_week === +selectedRecDayWeek &&
                      +obj.number_pair === +selectedRecNumberPair
                  );
                if (!checkSelectedRecSchedule) {
                  // Проверка не добавлена ли эта аудитория уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddRecScheduleToClass({
                      variables: {
                        day_week: +selectedRecDayWeek,
                        number_pair: +selectedRecNumberPair,
                        id_class: +item.id,
                      },
                    }).then((res) => {
                      const rs = JSON.parse(
                        res.data.AddRecScheduleToClass.data
                      );
                      if (res.data.AddRecScheduleToClass.successful) {
                        handleChangeItem("recommended_schedules", [
                          ...item.recommended_schedules,
                          {
                            id: rs.id,
                            day_week: rs.day_week,
                            number_pair: rs.number_pair,
                          },
                        ]);
                      }
                      CreateNotification(res.data.AddRecScheduleToClass);
                    });
                  } else {
                    // Создание элемента
                    let arrRS = item.recommended_schedules;
                    arrRS.push({
                      id: counterRecSchedules,
                      day_week: selectedRecDayWeek,
                      number_pair: selectedRecNumberPair,
                    });
                    handleChangeItem("recommended_schedules", arrRS);
                    handleIncCounter("counterRecSchedules");
                  }
                  handleChangeState("selectedRecNumberPair", null);
                  handleChangeState("selectedRecDayWeek", null);
                } else {
                  handleChangeState("selectedRecDayWeek", {
                    status: false,
                    message: "",
                  });
                  handleChangeState("validatedRecNumberPair", {
                    status: false,
                    message: "Запис вже додано!",
                  });
                }
              } else {
                debugger;
                if (!selectedRecDayWeek)
                  handleChangeState("validatedRecDayWeek", {
                    status: false,
                    message: "День тижня не вибраний!",
                  });
                if (!selectedRecNumberPair)
                  handleChangeState("validatedRecNumberPair", {
                    status: false,
                    message: "Номер пари не вибраний!",
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
        onClick={(e) => handleChangeState("statusAddRecScheduleToClass", true)}
      >
        Додати час
      </Button>
    );
  }
}
