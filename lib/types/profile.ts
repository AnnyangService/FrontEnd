import { Cat } from "./cat";

export interface UserInfo {
  name: string;
  email: string;
  recordCount: number;
  chatCount: number;
  cats: Pick<Cat, 'id' | 'name' | 'birthDate' | 'lastDiagnosis' | 'image'>[];
}