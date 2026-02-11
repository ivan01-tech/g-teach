export enum UserRole {
    Student = "student",
    Tutor = "tutor",
    Admin = "admin",
}

export const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
        case 'student':
            return 'Étudiant';
        case 'tutor':
            return 'Tuteur';
        case 'admin':
            return 'Administrateur';
        default:
            return role;
    }
};