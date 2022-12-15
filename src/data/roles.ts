export enum ROLES {
  ADMIN = 1,
  STUDENT,
  TEACHER
}

const roles: { [key in keyof typeof ROLES]: ROLES } = {
  ADMIN: 1,
  STUDENT: 2,
  TEACHER: 3
}
export default roles
