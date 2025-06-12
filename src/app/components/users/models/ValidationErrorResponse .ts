export interface ValidationErrorResponse {
  errors: { [key: string]: string[] };
  title?: string;
  status?: number;
}
