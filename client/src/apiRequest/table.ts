import http from "@/lib/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

const tableApiRequest = {
  getListTables: () => http.get<TableListResType>("/tables"),
  getTableDetail: (number: number) =>
    http.get<TableResType>(`/tables/${number}`),
  addTable: (data: CreateTableBodyType) =>
    http.post<TableResType>("/tables", data),
  updateTable: (number: number, data: UpdateTableBodyType) =>
    http.put<TableResType>(`/tables/${number}`, data),
  deleteTable: (number: number) =>
    http.delete<TableResType>(`/tables/${number}`),
};
export default tableApiRequest;
