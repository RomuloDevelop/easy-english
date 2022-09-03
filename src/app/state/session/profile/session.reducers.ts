import { Session } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as UserActions from './session.actions'

export const initialState: Session = {
  actualUser: null,
  userNotes: [],
  enrollment: null
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
  on(UserActions.setUserNotes, (state, { userNotes }) => ({
    ...state,
    userNotes
  })),
  on(UserActions.addUserNote, (state, { userNote }) => ({
    ...state,
    userNotes: [...state.userNotes, userNote]
  })),
  on(UserActions.updateUserNote, (state, { userNote }) => ({
    ...state,
    userNotes: state.userNotes.map((item) =>
      item.id === userNote.id ? { ...item, ...userNote } : item
    )
  })),
  on(UserActions.updateUserNotes, (state, { userNotes }) => ({
    ...state,
    userNotes: state.userNotes.map((item) => ({
      ...(userNotes.find((userNote) => userNote.id === item.id) || {}),
      ...item
    }))
  })),
  on(UserActions.setEnrollment, (state, { enrollment }) => ({
    ...state,
    enrollment
  }))
)

export function reducer(state: Session | undefined, action: Action) {
  return actualUserReducer(state, action)
}
