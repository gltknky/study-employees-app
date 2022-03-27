import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { AppContext } from '../context/app-context';

const IntroScreen = () => {
  const navigation = useNavigation();
  const { state: { auth } } = useContext(AppContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View
      style={styles.container}
    >
      {
        (!!auth) &&
        (
          <Text

          >{`Welcome ${auth?.user.name}`}</Text>
        )
      }
      <ActivityIndicator size={'large'} color={'dimgray'} />
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    alignContent: 'center'
  },
  greeting: {
    margin: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  }
});