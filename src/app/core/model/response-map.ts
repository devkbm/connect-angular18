export interface ResponseMap<T> {
  total: number;
  success: boolean;
  message: string;
  data: Map<string, Array<T>>;
}
