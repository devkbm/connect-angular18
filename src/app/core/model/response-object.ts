export interface ResponseObject<T> {
  total: number;
  success: boolean;
  message: string;
  data: T;
}
