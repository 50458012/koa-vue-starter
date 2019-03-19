import * as types from './types';

export default {
  [types.M_GET_ABOUT](state, key) {
    state.name = key
  }
}