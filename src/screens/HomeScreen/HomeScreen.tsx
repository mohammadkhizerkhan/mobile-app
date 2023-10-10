import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import withHeader from '../../helpers/withHeader';
import { storeData } from '../../utils/dataStore';
import Strings from '../../i18n/en';
import { updateStatus } from '../AuthScreen/Util';
import { HomeViewStyle } from './styles';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../context/type';

const HomeScreen = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { data }: { data: User } = useSelector((store) => store.user);

  const changeStatus = (status: string) => {
    setLoader(true);
    data.id &&
      updateStatus(status)
        .then(() => {
          dispatch({ type: 'UPDATE_USER_STATUS', payload: status });
          storeData(
            'userData',
            JSON.stringify({
              ...data,
              status: status,
            }),
          );
        })
        .catch((err) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
            position: 'bottom',
            bottomOffset: 80,
          });
        })
        .finally(() => setLoader(false));
  };

  const renderScreen = () => {
    if (data?.status === Strings.OUT_OF_OFFICE) {
      return (
        <>
          <Text style={HomeViewStyle.heading}>{Strings.OOOStatus_Text}</Text>
          <TouchableOpacity onPress={() => changeStatus(Strings.ACTIVE)}>
            <Text style={HomeViewStyle.oooBtn}>{Strings.OOOBtn2_Text}</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <View>
        <Text style={HomeViewStyle.heading}>
          {data?.status === Strings.ACTIVE
            ? Strings.Active_Text
            : Strings.Idle_Text}
        </Text>
        {loader ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => changeStatus(Strings.OUT_OF_OFFICE)}
            >
              <Text style={HomeViewStyle.oooBtn}>{Strings.OOOBtn1_Text}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return <View style={HomeViewStyle.container}>{renderScreen()}</View>;
};

export default withHeader(HomeScreen);
