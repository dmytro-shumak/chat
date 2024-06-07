import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "../config";

const baseURL = config.BACKEND_URL;

const instance = axios.create({
  baseURL,
  timeout: 5000,
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await instance(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<T>>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else if (axiosError.request) {
      throw new Error("Request failed. Please check your network connection.");
    } else {
      throw new Error("An error occurred while making the API request.");
    }
  }
}

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const requestConfig: AxiosRequestConfig = {
    ...config,
    method: "GET",
    url,
  };
  return request<T>(requestConfig);
}

async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const requestConfig: AxiosRequestConfig = {
    ...config,
    method: "POST",
    url,
    data,
  };
  return request<T>(requestConfig);
}

export { get, post };
