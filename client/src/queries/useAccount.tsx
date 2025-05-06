import accountApiRequest from "@/apiRequest/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: () => accountApiRequest.me(),
  });
};

export const useAccountMeUpdate = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useAccountChangePassword = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};
