import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useContext } from 'react';
import {
  StyleSheet, TextInput, View, Text, ScrollView,
  Keyboard, KeyboardAvoidingView, Pressable, ActivityIndicator,
} from 'react-native';
import { isEmailValid } from '../services/utils';
import authService from '../services/auth.service';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { AppContext, AppContextState } from '../context/app-context';

interface IFormState {
  email: string;
  password: string;
  emailValid: boolean;
  passwordValid: boolean;
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formState, setFormState] = useState<IFormState>({
    email: 'test@contenta.ai',
    password: 'secret',
    emailValid: true,
    passwordValid: true
  });

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const { setState } = useContext(AppContext);

  const onLoginPress = async () => {
    if (loading) {
      return;
    }
    setErrortext('');
    const { email, password } = formState;
    try {
      setLoading(true);
      const auth = await authService.login(email, password);
      if (!!auth) {
        await authService.setTokenToStorage(JSON.stringify(auth));
        setLoading(false);
        setState((prevState: AppContextState) => ({
          ...prevState,
          auth: auth,
          initializing: false
        }));
      } else {
        setErrortext('Invalid email or password');
      }
    } catch (error: any) {
      setErrortext(error.message);
    }
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <FaIcon name={'lock'} size={100} color={'white'} />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(text: string) => {
                  setFormState((prevState: IFormState) => ({
                    ...prevState,
                    email: text,
                    emailValid: text?.trim() ?
                      isEmailValid(text?.trim()) : false,
                  }));
                }
                }
                ref={emailInputRef}
                value={formState.email}
                defaultValue={formState.email}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(text: string) => {
                  setFormState((prevState: IFormState) => ({
                    ...prevState,
                    password: text?.trim(),
                    passwordValid: text?.trim().length > 5,
                  }));
                }}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                value={formState.password}
                defaultValue={formState.password}
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {'Login not successful. Please try again.'}
              </Text>
            ) : null}
            <Pressable
              disabled={(!formState.emailValid || !formState.passwordValid || loading)}
              style={{
                ...styles.buttonStyle,
                backgroundColor: (!formState.emailValid || !formState.passwordValid || loading) ? 'darkgray' : '#7DE24E',
              }}
              onPress={onLoginPress}>
              {
                loading ?
                  (
                    <ActivityIndicator size="small" color="white" />
                  )
                  : (
                    <Text style={styles.buttonTextStyle}>LOGIN</Text>
                  )
              }
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    justifyContent: 'center'
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});