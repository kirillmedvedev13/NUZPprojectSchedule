import { Form, Card } from "react-bootstrap";
import ButtonSubmitData from "./ButtonSubmitData";
import SelectCathedra from "./SelectCathedra";
import React from "react";
import ButtonGetTemplate from "./ButtonGetTemplate";

export default class FormDataLoad extends React.Component {
  render() {
    const {
      setFile,
      file,
      sheetIndex,
      id_cathedra,
      sheets,
      handleChangeState,
    } = this.props;
    return (
      <div className="d-flex justify-content-center  ">
        <Card className="my-2">
          <Card.Header className="text-center">Відомість заручень</Card.Header>
          <Card.Body>
            <Form.Group controlId="formFileLg" className=" bg-light mb-3">
              <Form.Control
                type="file"
                size="md"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <SelectCathedra
                id_cathedra={id_cathedra}
                handleChangeState={handleChangeState}
              ></SelectCathedra>
              <Form.Select
                onChange={(e) => {
                  handleChangeState("sheetIndex", e.target.value);
                }}
              >
                {sheets.map((sh, index) => {
                  return (
                    <option key={index} value={index}>
                      {sh}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Card.Footer>
              <ButtonGetTemplate></ButtonGetTemplate>
              <ButtonSubmitData
                id_cathedra={id_cathedra}
                file={file}
                sheetIndex={sheetIndex}
              ></ButtonSubmitData>
            </Card.Footer>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
