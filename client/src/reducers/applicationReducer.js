import { ACTION_TYPES } from './actionTypes';

export const applicationReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ALL:
      return action.payload;

    case ACTION_TYPES.ADD:
      return [action.payload, ...state];

    case ACTION_TYPES.UPDATE:
      return state.map((app) =>
        app.id === action.payload.id ? action.payload : app
      );

    case ACTION_TYPES.DELETE:
      return state.filter((app) => app.id !== action.payload);

    default:
      return state;
  }
};

export const initialState = [];
