export interface BaseSessionDto {
  name: string;
  description: string;
  minutes: number;
  numberOfSets: number;
  imageUrl: string;
}

export interface CreateSessionDto extends BaseSessionDto {}

export interface GetSessionDto extends BaseSessionDto {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionResponse {
  data: GetSessionDto;
  message?: string;
  success: boolean;
}
