import * as types from './types';

export default {
  [types.M_GET_HOME](state, key) {
    state.name = key
  }
}