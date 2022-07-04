import { Button } from "react-bootstrap";
import GetExcelFIle from "./GetExcelFile";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "./queries";

export default function ButtonGetTableExcel({
  refTable,
  nameTable,
  wb,
  setWorkBook,
}) {
  const { loading, error, data } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className="d-flex justify-content-end my-2">
      <Button
        onClick={() => {
          GetExcelFIle(refTable, nameTable, data.GetInfo, wb, setWorkBook);
        }}
      >
        Завантажити таблицю
      </Button>
    </div>
  );
}
