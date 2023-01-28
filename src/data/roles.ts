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

export const DASHBOARD_ROLES = [ROLES.TEACHER, ROLES.ADMIN]
export const VIEW_COURSE_ROLES = [ROLES.STUDENT, ROLES.PROSPECT]

export default roles
