import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from 'react-query';
import { EmployeeCreateUpdateModel } from '../models/employee-models';
import employeesService from '../services/employees.service';
import { AppContext, AppContextState } from '../context/app-context';


const EmployeeCreateUpdateScreen = (props: { route: any }) => {
  const { route: { params } } = props;
  const navigation = useNavigation();
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const departmentRef = useRef<TextInput>(null);
  const [canConfirm, setCanConfirm] = useState(false);
  const cache = useQueryClient();

  const { state: {
    selectedEmployee,
  }, setState } = useContext(AppContext);

  const getPostModel = () => {
    return {
      first_name: formState.firstName.trim(),
      last_name: formState.lastName.trim(),
      department: formState.department.trim(),
    };
  };

  const onSuccess = () => {
    Alert.alert('Success', `Employee ${params.operation === 'update' ? 'updated' : 'created'} successfully`);
    cache.invalidateQueries('employees');
    navigation.dispatch(CommonActions.goBack());
  };

  const onError = (err: any) => {
    Alert.alert('Error', err.message, [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Try Again',
        onPress: () => {
          const model = getPostModel();
          if (params.operation == 'create') {
            create(model);
          } else {
            update(model);
          }
        },
      }
    ]);
  }

  const { mutate: create } = useMutation(
    (model: EmployeeCreateUpdateModel) => employeesService.create(model),
    {
      onSuccess,
      onError
    });

  const { mutate: update } = useMutation(
    (model: EmployeeCreateUpdateModel) => {
      const id = selectedEmployee ? selectedEmployee.uuid : '';
      return employeesService.update(id, model)
    },
    {
      onSuccess,
      onError
    });

  const [formState, setFormState] = useState<{
    firstName: string;
    lastName: string;
    department: string;
  }>({
    firstName: '',
    lastName: '',
    department: '',
  });

  const onSubmit = () => {
    const model = getPostModel();
    if (params.operation === 'create') {
      create(model);
    } else {
      update(model);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params.operation === 'create' ?
        'Create Employee' :
        'Edit Employee',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  useFocusEffect(React.useCallback(() => {
    return () => {
      setState((prevState: AppContextState) => ({
        ...prevState,
        selectedEmployee: null
      }));
    }
  }, []));

  useEffect(() => {
    if (params) {
      const { operation } = params;
      if (operation === 'update' && selectedEmployee) {
        const { first_name, last_name, department } = selectedEmployee;
        setFormState({
          firstName: first_name,
          lastName: last_name,
          department,
        });
      }
    }
  }, [params]);

  useEffect(() => {
    if (!(formState.firstName && formState.firstName.trim().length > 0)) {
      setCanConfirm(false);
    } else if (!(formState.lastName && formState.lastName.trim().length > 0)) {
      setCanConfirm(false);
    } else if (!(formState.department && formState.department.trim().length > 0)) {
      setCanConfirm(false);
    } else {
      if (params.operation === 'create') {
        setCanConfirm(true);
      } else {
        let currentJson = '';
        if (selectedEmployee) {
          const { first_name, last_name, department } = selectedEmployee;
          currentJson = JSON.stringify({ first_name, last_name, department });
        }
        const newJson = JSON.stringify(getPostModel());
        if (currentJson !== newJson) {
          setCanConfirm(true);
        } else {
          setCanConfirm(false);
        }
      }
    }
  }, [formState]);

  return (
    <SafeAreaView
      style={{ flex: 1 }}
    >
      <View
        style={styles.formWrapper}
      >
        <View
          style={styles.formGroup}
        >
          <Text
            style={styles.inputLabel}
          >First Name :</Text>
          <TextInput
            ref={firstNameRef}
            value={formState.firstName}
            onChangeText={(text) => setFormState({ ...formState, firstName: text })}
            style={styles.input}
          />
        </View>
        <View
          style={styles.formGroup}
        >
          <Text
            style={styles.inputLabel}
          >Last Name :</Text>
          <TextInput
            ref={lastNameRef}
            value={formState.lastName}
            onChangeText={(text) => setFormState({ ...formState, lastName: text })}
            style={styles.input}
          />
        </View>
        <View
          style={styles.formGroup}
        >
          <Text
            style={styles.inputLabel}
          >Department :</Text>
          <TextInput
            ref={departmentRef}
            value={formState.department}
            onChangeText={(text) => setFormState({ ...formState, department: text })}
            style={styles.input}
          />
        </View>
        <Button
          disabled={!canConfirm}
          onPress={onSubmit}
          title={params.operation === 'create' ? 'Confirm Add' : 'Confirm Update'}
        />
      </View>

    </SafeAreaView>
  );
};

export default EmployeeCreateUpdateScreen;

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10
  },
  formGroup: {
    marginBottom: 10
  },
  inputLabel: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5
  }
});