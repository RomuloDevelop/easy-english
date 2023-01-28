import { DEFAULT_HTTP_ERROR_MESSAGE } from 'src/data/constants'
import { DASHBOARD_ROLES, VIEW_COURSE_ROLES } from 'src/data/roles'
import { User } from '../state/models'

export function getScreenPathFromRole(user: User) {
  const isAdmin = DASHBOARD_ROLES.some((role) => user.role === role)
  const isStudent = VIEW_COURSE_ROLES.some((role) => user.role === role)

  if (!isAdmin && !isStudent) {
    throw {
      defaultMessage: DEFAULT_HTTP_ERROR_MESSAGE
    }
  }

  return isAdmin ? 'admin' : 'student'
}
