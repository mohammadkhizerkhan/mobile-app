// TODO: by default read from env file
export const featureFlagState = {
  isProdEnvironment: true,
  userToken: '',
};

const reduxGlobalState = (
  state = featureFlagState,
  action: any,
): typeof featureFlagState => {
  switch (action.type) {
    case 'PROD':
      return {
        ...state,
        isProdEnvironment: true,
      };
    case 'DEV':
      return {
        ...state,
        isProdEnvironment: false,
      };
    case 'STORE_TOKEN':
      return {
        ...state,
        userToken: action.payload,
      };
    default:
      return state;
  }
};

export default reduxGlobalState;
