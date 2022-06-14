import { XCircle } from "react-bootstrap-icons";
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_RECOMMENDED_AUDIENCE_TO_CLASS,
  DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS,
} from "./mutations";
import { GET_ALL_AUDIENCES } from "../Audience/queries";
import ValidatedMessage from "../ValidatedMessage";

export function TableRecAudience({ item, handleChangeItem }) {
  const [DelRecAudienceFromClass, { loading, error }] = useMutation(
    DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Аудиторія</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.recommended_audiences.map((itemRA) => (
          <tr key={Number(itemRA.id)}>
            <td>{itemRA.audience.name}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelRecAudienceFromClass({
                      variables: { id: Number(itemRA.id) },
                    }).then((res) => {
                      if (res.data.DeleteRecAudienceFromClass.successful) {
                        const arr_ra = item.recommended_audiences.filter(
                          (ra) => +ra.id !== +itemRA.id
                        );
                        handleChangeItem("recommended_audiences", arr_ra);
                      }
                      CreateNotification(res.data.DeleteRecAudienceFromClass);
                    });
                  } else {
                    // При добавлении
                    let arrRA = item.recommended_audiences.filter(
                      (ra) => Number(ra.id) !== Number(itemRA.id)
                    );
                    handleChangeItem("recommended_audiences", arrRA);
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

export function AddRecAudienceToClass({
  item,
  handleChangeItem,
  statusAddRecAudienceToClass,
  counterRecAudiences,
  validatedSelectedRecAudience,
  selectedRecAudience,
  handleChangeState,
  handleIncCounter,
}) {
  const query = useQuery(GET_ALL_AUDIENCES);
  const [AddRecAudienceToClass, { loading, error }] = useMutation(
    ADD_RECOMMENDED_AUDIENCE_TO_CLASS
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllAudiences.forEach((element) => {
    options.push({ label: element.name, value: Number(element.id) });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddRecAudienceToClass) {
    // Если открыт селект
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть аудиторію</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Аудиторія"
            onChange={(e) => {
              handleChangeState(
                "selectedRecAudience",
                query.data.GetAllAudiences.find((aud) => +aud.id === +e.value)
              );
              handleChangeState("validatedSelectedRecAudience", {
                status: true,
              });
            }}
          ></Select>
          {!validatedSelectedRecAudience.status && (
            <ValidatedMessage
              message={validatedSelectedRecAudience.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedRecAudience) {
                //Если полe в селекте не пустое
                const checkSelectedRecAudience =
                  item.recommended_audiences.find(
                    (ra) => +ra.audience.id === +selectedRecAudience.id
                  );
                if (!checkSelectedRecAudience) {
                  // Проверка не добавлена ли эта аудитория уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddRecAudienceToClass({
                      variables: {
                        id_audience: Number(selectedRecAudience.id),
                        id_class: Number(item.id),
                      },
                    }).then((res) => {
                      const ra = JSON.parse(
                        res.data.AddRecAudienceToClass.data
                      );
                      if (res.data.AddRecAudienceToClass.successful) {
                        handleChangeItem("recommended_audiences", [
                          ...item.recommended_audiences,
                          {
                            id: ra.id,
                            audience: selectedRecAudience,
                          },
                        ]);
                      }
                      CreateNotification(res.data.AddRecAudienceToClass);
                    });
                  } else {
                    // Создание элемента
                    let arrRA = item.recommended_audiences;
                    arrRA.push({
                      id: counterRecAudiences,
                      audience: selectedRecAudience,
                    });
                    handleChangeItem("recommended_audiences", arrRA);
                    handleIncCounter("counterRecAudience");
                  }
                  handleChangeState("selectedRecAudience", null);
                } else {
                  handleChangeState("validatedSelectedRecAudience", {
                    status: false,
                    message: "Аудиторію вже додано!",
                  });
                }
              } else {
                handleChangeState("validatedSelectedRecAudience", {
                  status: false,
                  message: "Аудиторія не вибрана!",
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
        onClick={(e) => handleChangeState("statusAddRecAudienceToClass", true)}
      >
        Додати аудиторію
      </Button>
    );
  }
}
