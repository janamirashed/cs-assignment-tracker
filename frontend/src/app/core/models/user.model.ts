export interface User {
    id: number;
    email: string;
    name: string;
    pictureUrl?: string;
    role: 'ADMIN' | 'STUDENT';
}
