import { call, put, takeEvery } from 'redux-saga/effects';
import { User } from '../../context/type';
import { getUserData } from '../../screens/AuthScreen/Util';

export function* fetchUserRequest(action:any) {
  try {
    const { token, tokenRequired } = action.payload;
    const user: User = yield call(getUserData, token ,tokenRequired);
    yield put({ type: 'FETCH_USER', payload: user });
  } catch (error: any) {
    yield put({ type: 'FETCH_USER_ERROR', message: error.message });
  }
}

function* watchUserRequestSaga() {
  yield takeEvery('GET_USER', fetchUserRequest);
}

export default watchUserRequestSaga;
