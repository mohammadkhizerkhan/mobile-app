import axios from 'axios';
import { apiEndpoints, urls } from '../../constants/appConstant/url';
import { HomeApi } from '../../constants/apiConstant/HomeApi';
import { PermissionsAndroid } from 'react-native';
import { getApi, patchApi } from '../../utils/apiRequests';
import { store } from '../../../App';
import { CurrentStatusPayload, User } from '../../context/type';
import { storeData } from '../../utils';

const token = store.getState().reduxGlobalState.userToken;
const mainConfig = {
  headers: {
    'Content-Type': 'application/json',
    Cookie: `rds-session=${token}`,
  },
};

export const getUserData = async (
  token: string,
  tokenRequired: boolean = false,
): Promise<User> => {
  try {
    const config = tokenRequired ? mainConfig : {};
    const res = await getApi({
      endPointName: apiEndpoints.GET_USERS_DATA,
      config: config,
    });
    const userData: User = {
      id: res.data.id,
      name: res.data.github_display_name,
      profileUrl: res.data?.picture?.url,
      status: '',
      twitterUrl: urls.GITHUB + res.data?.twitter_id,
      linkedInUrl: urls.LINKEDIN + res.data?.linkedin_id,
      githubUrl: urls.TWITTER + res.data?.github_id,
      userName: res?.data?.username,
      token: token,
      designation: res?.data.designation,
      company: res?.data.company,
    };
    await storeData('userData', JSON.stringify(userData));
    return userData;
  } catch (e) {
    console.log('err', e);
    throw e;
  }
};

export const fetchContribution = async (
  userName: string,
  tokenRequired: boolean = false,
): Promise<any> => {
  try {
    const config = tokenRequired ? mainConfig : {};
    const response = await getApi({
      endPointName: apiEndpoints.GET_CONTRIBUTIONS + `/${userName}`,
      config: config,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateStatus = async (
  status: string,
  tokenRequired: boolean = false,
) => {
  try {
    const config = tokenRequired ? mainConfig : {};
    const response = await patchApi({
      endPointName: apiEndpoints.GET_USERS_DATA,
      payload: { status },
      config: config,
    });
    return response.config.data.status;
  } catch (error) {
    return null;
  }
};

export const updateMarkYourSelfAs_ = async (markStatus: string) => {
  const res = await axios.patch(
    urls.GET_USERS_DATA,
    { status: markStatus },
    {
      headers: {
        cookie: '',
      },
    },
  );

  return res.data.status;
};

export const getUsersStatus = async (tokenRequired: boolean = false) => {
  try {
    const config = tokenRequired ? mainConfig : {};
    const response = await getApi({
      endPointName: apiEndpoints.GET_USERS_STATUS,
      config,
    });
    if (response.data.data.currentStatus) {
      return response.data.data.currentStatus.state;
    } else {
      return 'Something went wrong';
    }
  } catch (err) {
    return 'Something went wrong';
  }
};

export const submitOOOForm = async (
  data: CurrentStatusPayload,
  tokenRequired: boolean = false,
) => {
  const config = tokenRequired ? mainConfig : {};
  try {
    const response = await patchApi({
      endPointName: apiEndpoints.UPDATE_USERS_STATUS,
      payload: data,
      config: config,
    });
    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log('error', err);
  }
};

export const cancelOoo = async (tokenRequired: boolean = false) => {
  const config = tokenRequired ? mainConfig : {};
  const payload = { cancelOoo: true };
  try {
    const response = await patchApi({
      endPointName: apiEndpoints.UPDATE_USERS_STATUS,
      config,
      payload: payload,
    });
    if (response.status === 200) {
      console.log('response in cancelling', response);
      return response;
    } else {
      throw new Error('Api is failing');
    }
  } catch (err) {
    console.log('error', err);
  }
};

export const isValidTextInput = (code: string) =>
  Boolean(/^[\d]{1,4}$|^$/.test(code));

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Accessing your camera to scan the QR code',
        message:
          'RDS App needs access to your camera ' + 'so you can scan QR code',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export const formatTimeToUnix = (date) => {
  const newDate = new Date(date);

  // Convert the date to Unix Epoch timestamp in seconds
  const unixTimestampInSeconds = newDate.getTime() / 1000;
  return unixTimestampInSeconds;
};
