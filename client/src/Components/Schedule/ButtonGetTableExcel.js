import { Button } from "react-bootstrap";
import GetExcelFIle from "./GetExcelFile";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "./queries";

export default function ButtonGetTableExcel({ refTable, nameTable }) {
  const { loading, error, data } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className="d-flex justify-content-end my-2">
      <Button
        onClick={() => {
          GetExcelFIle(refTable, nameTable, data.GetInfo);
        }}
      >
        Завантажити таблицю
      </Button>
    </div>
  );
}
