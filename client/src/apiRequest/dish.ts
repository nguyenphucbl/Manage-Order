import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApiRequest = {
  list: () =>
    http.get<DishListResType>("/dishes", {
      next: { tags: ["dishes"] },
    }),
  getDetail: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  add: (body: CreateDishBodyType) => http.post<DishResType>("/dishes", body),
  update: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  delete: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};
export default dishApiRequest;
