import { Session } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as UserActions from './session.actions'

export const initialState: Session = {
  actualUser: null,
  userAnswers: [],
  userFinalQuizAnswers: [],
  enrollment: null,
  showFinalQuizReminder: true
}

const actualUserReducer = createReducer(
  initialState,
  on(UserActions.setActualUser, (state, { user }) => ({
    ...state,
    actualUser: user
  })),
  on(UserActions.updateActualUser, (state, { user }) => ({
    ...state,
    actualUser: {
      ...state.actualUser,
      ...user
    }
  })),
  on(UserActions.setUserAnswers, (state, { userAnswers }) => ({
    ...state,
    userAnswers
  })),
  on(UserActions.addUserAnswer, (state, { userAnswer }) => ({
    ...state,
    userAnswer: [...state.userAnswers, userAnswer]
  })),
  on(UserActions.updateUserAnswer, (state, { userAnswer }) => ({
    ...state,
    userAnswers: state.userAnswers.map((item) =>
      item.course_lesson_id === userAnswer.course_lesson_id
        ? { ...item, ...userAnswer }
        : item
    )
  })),
  on(UserActions.updateUserAnswers, (state, { userAnswers }) => ({
    ...state,
    userAnswers: state.userAnswers.map((item) => ({
      ...(userAnswers.find(
        (userAnswer) => userAnswer.course_lesson_id === item.course_lesson_id
      ) || {}),
      ...item
    }))
  })),
  on(
    UserActions.setUserFinalQuizAnswers,
    (state, { userFinalQuizAnswers }) => ({
      ...state,
      userFinalQuizAnswers: userFinalQuizAnswers
    })
  ),
  on(UserActions.addUserFinalQuizAnswer, (state, { userFinalQuizAnswer }) => ({
    ...state,
    userFinalQuizAnswers: [...state.userFinalQuizAnswers, userFinalQuizAnswer]
  })),
  on(UserActions.setEnrollment, (state, { enrollment }) => ({
    ...state,
    enrollment
  })),
  on(UserActions.setFinalQuizReminder, (state, { showFinalQuizReminder }) => ({
    ...state,
    showFinalQuizReminder
  }))
)

export function reducer(state: Session | undefined, action: Action) {
  return actualUserReducer(state, action)
}
