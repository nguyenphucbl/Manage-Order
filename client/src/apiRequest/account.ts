import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/accounts";
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),
  sMe: (accessToken: string) =>
    http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (data: UpdateMeBodyType) =>
    http.put<AccountResType>(`${prefix}/me`, data),
  changePassword: (data: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${prefix}/change-password`, data),
  list: () => http.get<AccountListResType>(`${prefix}`),
  addEmployee: (data: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(`${prefix}`, data),
  updateEmployee: (id: number, data: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, data),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/detail/${id}`),
  getEmployee: (id: number) =>
    http.get<AccountResType>(`${prefix}/detail/${id}`),
};
export default accountApiRequest;
