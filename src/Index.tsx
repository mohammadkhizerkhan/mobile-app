import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import TabNavigation from './navigations/TabNavigation/TabNavigation';
import AuthScreen from './screens/AuthScreen/AuthScreen';
import ErrorPopup from './components/ErrorPopUp/ErrorPopUp';
import { useDispatch, useSelector } from 'react-redux';
import { User } from './context/type';
import { getData } from './utils';

const Index = () => {
  const { isLoading, errorData, setErrorData } = useAuth();
  const { data }: { data: User } = useSelector((store) => store.user);
  const dispatch = useDispatch();


  useEffect(() => {
    getData('userData').then((res) => {
      console.log('storage data----------->', res);
      dispatch({ type: 'UPDATE_USER_DATA', payload: res });
      dispatch({ type: 'STORE_TOKEN', payload: res.token });
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data.token) {
    return <AuthScreen />;
  }

  return (
    <>
      <TabNavigation />
      {errorData.isError && (
        <ErrorPopup
          buttonAction={() => {
            if (errorData.handleError) {
              errorData.handleError();
            }
            setErrorData({
              isError: false,
              errorMessage: '',
            });
          }}
          displayMessage={errorData.errorMessage ?? 'something went wrong'}
        />
      )}
    </>
  );
};

export default Index;
