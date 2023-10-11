import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Strings from '../../i18n/en';
import OOOForm from '../../components/OOO/OOOForm';
import { AuthScreenButton } from '../AuthScreen/Button';
import {
  cancelOoo,
  formatTimeToUnix,
  getUsersStatus,
  submitOOOForm,
} from '../AuthScreen/Util';
import LoadingScreen from '../../components/LoadingScreen';
import { useSelector } from 'react-redux';
import { User } from '../../context/type';

const HomeScreenV2 = (): JSX.Element => {
  const { data: userData }: { data: User } = useSelector((store) => store.user);
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(currentDate);
  const [toDate, setToDate] = useState<Date>(tomorrowDate);
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchData = async () => {
    const userStatus = await getUsersStatus(true);
    setStatus(userStatus);
  };

  const handleButtonPress = async () => {
    if (status === 'OOO') {
      await cancelOoo(userData.token);
    } else {
      setIsFormVisible((prev) => !prev);
    }
  };

  const handleFormSubmit = async () => {
    setIsLoading(true); // Set loading state while making API call
    let data = {
      currentStatus: {
        from: formatTimeToUnix(fromDate),
        message: description,
        state: 'OOO',
        until: formatTimeToUnix(toDate),
        updateAt: formatTimeToUnix(Date.now),
      },
    };
    await submitOOOForm(data, true);
    setIsLoading(false); // Clear loading state after API call
    setIsFormVisible(false); // Hide the form after a successful submission
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>{status}</Text>
        <View style={{ marginTop: 50 }}>
          <AuthScreenButton
            text={
              status === 'OOO'
                ? Strings.CANCEL_OOO
                : Strings.UPDATE_STATUS_TO_OOO
            }
            onPress={handleButtonPress}
          />
        </View>
        {isFormVisible && (
          <OOOForm
            fromDate={fromDate}
            toDate={toDate}
            description={description}
            setToDate={setToDate}
            setFromDate={setFromDate}
            setDescription={setDescription}
            handleFormSubmit={handleFormSubmit}
            isLoading={isLoading}
            setIsFormVisible={setIsFormVisible}
          />
        )}
      </View>
      {isLoading && <LoadingScreen />}
    </View>
  );
};

export default HomeScreenV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
});
