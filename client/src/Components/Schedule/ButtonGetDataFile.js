import { Dropdown, DropdownButton } from "react-bootstrap";
import GetExcelFIle from "./GetExcelFile";

export default function ButtonGetDataFile({
  info,
  refTable,
  nameTable,
  wb,
  setWorkBook,
}) {
  return (
    <div className="d-flex justify-content-end my-2 mx-2">
      <DropdownButton id="dropdown-basic-button" title="Завантажити розклад">
        <Dropdown.Item
          onClick={() => {
            GetExcelFIle(refTable, nameTable, info, wb, setWorkBook);
          }}
        >
          В форматі XLSX
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
