import dishApiRequest from "@/apiRequest/dish";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDishList = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: () => dishApiRequest.list(),
  });
};
export const useGetDishDetail = (id: number) => {
  return useQuery({
    queryKey: ["dish", id],
    queryFn: () => dishApiRequest.getDetail(id),
    enabled: Boolean(id),
  });
};
export const useAddDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};
export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: number;
    } & UpdateDishBodyType) => dishApiRequest.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
      queryClient.setQueryData(["dish", variables.id], response);
    },
  });
};
export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dishApiRequest.delete(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
      queryClient.removeQueries({
        queryKey: ["dish", id],
      });
    },
  });
};
