import { BaseUserFitnessPlanDto } from "./BaseUserFitnessPlanDto";

export interface GetUserFitnessPlanDto extends BaseUserFitnessPlanDto {
    id: string;
    fitnessCategoryName: string;
    trainingName: string;
    numberOfDays: number;
}
