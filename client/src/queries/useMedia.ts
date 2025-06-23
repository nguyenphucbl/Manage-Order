import { mediaApiRequest } from "@/apiRequest/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: (formData: FormData) => mediaApiRequest.upload(formData),
    // mutationKey: ["upload-media"],
  });
};
