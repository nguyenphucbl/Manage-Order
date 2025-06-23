import tableApiRequest from "@/apiRequest/table";
import {
  CreateTableBodyType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useGetListTable = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () => tableApiRequest.getListTables(),
  });
};
const useGetDetailTable = (number: number) => {
  return useQuery({
    queryKey: ["table", number],
    queryFn: () => tableApiRequest.getTableDetail(number),
    enabled: Boolean(number),
  });
};

const useAddTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTableBodyType) => tableApiRequest.addTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};
const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      number,
      ...data
    }: { number: number } & UpdateTableBodyType) =>
      tableApiRequest.updateTable(number, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.setQueryData(["table", variables.number], response);
    },
  });
};
const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (number: number) => tableApiRequest.deleteTable(number),
    onSuccess: (response, number) => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.removeQueries({ queryKey: ["table", number] });
    },
  });
};
export {
  useGetListTable,
  useGetDetailTable,
  useAddTable,
  useUpdateTable,
  useDeleteTable,
};
