import { AxiosStatic, AxiosRequestConfig, CancelTokenSource } from "axios";

export interface CancelRequestInterceptorProps {
  condition: (config: AxiosRequestConfig) => boolean;
  forceCancel?: boolean;
  once?: boolean;
  onCancel?: (source: CancelTokenSource) => void;
}

export const withCancelRequestInterceptor =
  (axios: AxiosStatic) =>
  ({ condition, onCancel, forceCancel, once }: CancelRequestInterceptorProps) => {
    const cancelRequestsInterceptor = axios.interceptors.request.use((config) => {
      if (condition(config)) {
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        if (once) axios.interceptors.request.eject(cancelRequestsInterceptor);
        if (forceCancel) source.cancel();
        if (onCancel) onCancel(source);
      }

      return config;
    });

    return () => axios.interceptors.request.eject(cancelRequestsInterceptor);
  };
