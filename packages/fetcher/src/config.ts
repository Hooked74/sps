import url from "url";
import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import { GlobalManager, EnvManager } from "@h74-sps/utils";
import { fetchAdapter } from "./adapters";
import { withHandleExceptionInterceptor, withValidationInterceptor } from "./interceptors";

axios.defaults.headers.common["Content-Type"] = "application/json;charset=UTF-8";

axios.defaults.baseURL = EnvManager.get("SPS_API_PREFIX", "/api");
axios.defaults.timeout = 2500;
axios.defaults.withCredentials = true;
axios.defaults.paramsSerializer = (query) => url.format({ query }).slice(1);
axios.defaults.adapter = GlobalManager.isClient() ? fetchAdapter : httpAdapter;

withValidationInterceptor(axios);
withHandleExceptionInterceptor(axios);

export { axios };
