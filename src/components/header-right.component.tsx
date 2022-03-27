import React, { useContext } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { AppContext, initialContextState } from '../context/app-context';
import authService from '../services/auth.service';
import FaIcon from '@expo/vector-icons/FontAwesome';

const HeaderRightComponent = () => {
  const { setState, state: {
    auth
  } } = useContext(AppContext);
  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        Alert.alert('', `Do you want to logout from ${auth?.user.name}`, [
          {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: () => {
              authService.logout().then(() => {
                setState(() => ({
                  ...initialContextState
                }))
              });;
            }
          }
        ]);
      }}
    >
      <Text style={styles.text}>Logout</Text>
      <FaIcon name='power-off' size={18} color='dimgray' />
    </Pressable>
  )
}

export default HeaderRightComponent;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 70,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: 'black',
  }
});