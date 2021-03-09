export interface ResponseResult {
  code: number;
}

export interface Response<T> {
  result: ResponseResult;
  objects?: T[] | T;
  [key: string]: any;
}

export interface HttpResponse<T> extends Response<T> {
  statusCode: number;
  message?: string;
}
