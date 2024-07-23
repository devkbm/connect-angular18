export interface ResponseList<T> {
  total: number;
  success: boolean;
  message: string;
  data: Array<T>;
}
