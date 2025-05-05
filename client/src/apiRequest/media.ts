import http from "@/lib/http";

export const mediaApiRequest = {
  upload: (formData: FormData) => http.post("/media/upload", formData),
};
