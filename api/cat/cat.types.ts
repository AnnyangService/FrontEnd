interface Cat {
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

export type CatApiData = {
    cats: Cat[];
    cat: Cat;
}

export type CatInputData = {
    registerCat: {
        name: string;
        image: string;
        birthDate: string;
        breed: string;
        gender: "MALE" | "FEMALE";
        weight: number;
        lastDiagnosis: string;
        specialNotes: string;
    }
}