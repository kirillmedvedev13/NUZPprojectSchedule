import React from "react";
import { Table } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_DISCIPLINE_FROM_SPECIALTY } from "./mutations";
import { CreateNotification } from "../Alert";
import { XCircle } from "react-bootstrap-icons";

export default function TableSpecialties({ item, handleChangeItem }) {
  const [DelDiscFromSpecialty, { loading, error }] = useMutation(
    DELETE_DISCIPLINE_FROM_SPECIALTY
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Назва спеціальності</th>
          <th>Семестр</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.assigned_disciplines.map((itemDisc) => (
          <tr key={+itemDisc.id}>
            <td>{itemDisc.specialty.name}</td>
            <td>{itemDisc.semester}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelDiscFromSpecialty({
                      variables: { id: +itemDisc.id },
                    }).then((res) => {
                      if (res.data.DeleteDisciplineFromSpecialty.successful) {
                        let arrDisc = item.assigned_disciplines.filter(
                          (disc) => +disc.id !== +itemDisc.id
                        );
                        handleChangeItem("assigned_disciplines", arrDisc);
                      }
                      CreateNotification(
                        res.data.DeleteDisciplineFromSpecialty
                      );
                    });
                  } else {
                    // При добавлении
                    let arrDisc = item.assigned_disciplines.filter(
                      (disc) => +disc.id !== +itemDisc.id
                    );
                    handleChangeItem("assigned_disciplines", arrDisc);
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
