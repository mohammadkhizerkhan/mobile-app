import { User } from '../context/type';

export const userStore: {
  data: User | null;
  loading: boolean;
  error: string;
} = {
  data: {
    id: '',
    name: '',
    profileUrl: '',
    userName: '',
    status: '',
    designation: '',
    company: '',
    linkedInUrl: '',
    twitterUrl: '',
    githubUrl: '',
    token: '',
  },
  loading: false,
  error: '',
};

const user = (state = userStore, action: any) => {
  switch (action.type) {
    case 'FETCH_USER':
      return { ...state, loading: false, data: { ...action.payload } };
    case 'GET_USER':
      return { ...state, loading: true };
    case 'FETCH_USER_ERROR':
      return { ...state, loading: false, error: action.message };
    case 'UPDATE_USER_STATUS':
      return { ...state, data: { ...state.data, status: action.payload } };
    case 'UPDATE_USER_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default user;
