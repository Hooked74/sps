import { AxiosStatic, AxiosResponse } from "axios";
import validation from "@h74-sps/validation";

export const withValidationInterceptor = (axios: AxiosStatic) => {
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.config?.validationSchema) {
      validation.attempt(response.data, response.config.validationSchema);
    }

    return response;
  });
};
