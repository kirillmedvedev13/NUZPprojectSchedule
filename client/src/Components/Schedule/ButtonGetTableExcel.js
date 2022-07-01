import { Button } from "react-bootstrap";
import GetExcelFIle from "./GetExcelFile";

export default function ButtonGetTableExcel({ refTable, nameTable }) {
  return (
    <div className="d-flex justify-content-end my-2">
      <Button
        onClick={() => {
          GetExcelFIle(refTable, nameTable);
        }}
      >
        Завантажити таблицю
      </Button>
    </div>
  );
}
