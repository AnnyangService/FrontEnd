export interface Cat {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  image: string;
  birthDate: string;
  breed: string;
  gender: 'FEMALE' | 'MALE';
  weight: number;
  lastDiagnosis: string;
  specialNotes: string;
}
