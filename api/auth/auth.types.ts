export type AuthApiData = {
    login: {
        accessToken: string;
    }
    signup: string;
    logout: string;
    me: {
        email: string;
        name: string;
    }
}