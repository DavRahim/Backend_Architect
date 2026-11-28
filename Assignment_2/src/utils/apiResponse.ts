export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T | null = null,
    public statusCode?: number,
  ) {}

  static success<T>(data: T, message = "Success") {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, statusCode = 500) {
    return new ApiResponse<never>(false, message, null, statusCode);
  }
}
