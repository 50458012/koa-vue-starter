import * as types from './types';

export default {
  [types.A_GET_ABOUT]({commit}, key) {
    commit(types.M_GET_ABOUT, key)
  }
}