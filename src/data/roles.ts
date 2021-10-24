export enum Roles {
  admin = 1,
  student = 2,
  teacher = 3
}

const roles: { [key in keyof typeof Roles]: Roles } = {
  admin: 1,
  student: 2,
  teacher: 3
}
export default roles
