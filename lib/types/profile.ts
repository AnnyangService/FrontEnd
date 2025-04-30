export interface UserInfo {
  name: string;
  email: string;
  recordCount: number;
  chatCount: number;
  cats: CatInfo[];
}

export interface CatInfo {
  id: number;
  name: string;
  birthDate: string;
  recentDiagnosis: string;
  image: string;
}
