import React from "react";
import { Table } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_AUDIENCE_FROM_CATHEDRA } from "./mutations";
import { CreateNotification } from "../Alert";
import { XCircle } from "react-bootstrap-icons";

export default function SelectCathedras({ item, handleChangeItem }) {
  const [DelAudFromCathedra, { loading, error }] = useMutation(
    DELETE_AUDIENCE_FROM_CATHEDRA
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Назва кафедри</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.assigned_audiences.map((itemAU) => (
          <tr key={Number(itemAU.id)}>
            <td>{itemAU.cathedra.name}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelAudFromCathedra({
                      variables: { id: +itemAU.id },
                    }).then((res) => {
                      console.log(res);
                      if (res.data.DeleteAudienceFromCathedra.successful) {
                        let arrAU = item.assigned_audiences.filter(
                          (au) => +au.id !== +itemAU.id
                        );
                        handleChangeItem("assigned_audiences", arrAU);
                      }

                      CreateNotification(res.data.DeleteAudienceFromCathedra);
                    });
                  } else {
                    // При добавлении
                    let arrAU = item.assigned_audiences.filter(
                      (au) => +au.id !== +itemAU.id
                    );
                    handleChangeItem("assigned_audiences", arrAU);
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
