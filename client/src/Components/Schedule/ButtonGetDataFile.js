import { Dropdown, DropdownButton } from "react-bootstrap";
import GetExcelFIle from "./GetExcelFile";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "./queries";
import GetJsonFile from "./GetJsonFile";

export default function ButtonGetDataFile({
  info,
  refTable,
  nameTable,
  wb,
  setWorkBook,
}) {
  return (
    <div className="d-flex justify-content-end my-2">
      <DropdownButton id="dropdown-basic-button" title="Завантажити розклад">
        <Dropdown.Item
          onClick={() => {
            GetExcelFIle(refTable, nameTable, info, wb, setWorkBook);
          }}
        >
          В форматі XLSX
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            GetJsonFile(refTable, nameTable, info, wb, setWorkBook);
          }}
        >
          В форматі JSON
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
