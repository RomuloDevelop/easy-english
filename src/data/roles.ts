export enum ROLES {
  ADMIN = 1,
  STUDENT,
  TEACHER,
  PROSPECT
}

const roles: { [key in keyof typeof ROLES]: ROLES } = {
  ADMIN: 1,
  STUDENT: 2,
  TEACHER: 3,
  PROSPECT: 4
}
export default roles
