import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  me: () => http.get<AccountResType>("/accounts/me"),
  updateMe: (data: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", data),
  changePassword: (data: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", data),
};
export default accountApiRequest;
