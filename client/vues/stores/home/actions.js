import * as types from './types';

export default {
  [types.A_GET_HOME]({commit}, key) {
    commit(types.A_GET_HOME, key)
  }
}