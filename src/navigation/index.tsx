import * as React from 'react';
import {
  NavigationContainer, DefaultTheme, DarkTheme
} from '@react-navigation/native';
import { ColorSchemeName } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext } from '../context/app-context';
import HomeScreen from '../screens/home.screen';
import EmployeeListScreen from '../screens/employee-list.screen';
import EmployeeCreateUpdateScreen from '../screens/employee-create-edit.screen';
import LoginScreen from '../screens/login.screen';
import IntroScreen from '../screens/intro-screen';
import HeaderRightComponent from '../components/header-right.component';
import EmployeeDetailScreen from '../screens/employee-detail';

const Stack = createNativeStackNavigator();

export default function NavContainer({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { state } = React.useContext(AppContext);
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme
      }>
      <Stack.Navigator
        initialRouteName='Intro'
        screenOptions={{
          headerBackTitleVisible: false,
          headerRight: () => state.auth ? (<HeaderRightComponent />) : null,
        }}
      >
        {
          state.initializing && <Stack.Screen name="Intro" component={IntroScreen} />
        }
        {
          !!(state.auth) ?
            (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
                <Stack.Screen name="EmployeeCreateUpdate" component={EmployeeCreateUpdateScreen} />
                <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
              </>
            )
            :
            (
              <Stack.Screen
                options={{
                  headerShown: false
                }}
                name="Login" component={LoginScreen} />
            )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};
