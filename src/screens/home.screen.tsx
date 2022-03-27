import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, useWindowDimensions, View
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IEmployee, IEmployeesResponse } from '../models/employee-models';
import employeesService from '../services/employees.service';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { CommonActions, useNavigation } from '@react-navigation/core';
import ActionSheet from 'react-native-actionsheet';
import { AppContext, AppContextState } from '../context/app-context';

const { width: appWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [pagesState, setPagesState] = useState<{
    current: number;
    total: number;
  }>({
    current: 1,
    total: 1
  });

  const { state: {
    selectedEmployee
  }, setState } = useContext(AppContext);
  const optionArray = ['Detail', 'Edit', 'Delete', 'Cancel'];
  const cache = useQueryClient();
  const handleDeleteEmployee = () => {
    Alert.alert('Delete',
      `Are you sure you want to remove employee named ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            removeEmployee();
          },
          style: 'destructive'
        }
      ]);
  };

  const handleEditEmployee = () => {
    navigation.dispatch(CommonActions.navigate({
      name: 'EmployeeCreateUpdate',
      params: {
        operation: 'update'
      }
    }))
  };

  const handleViewDetail = () => {
    navigation.dispatch(CommonActions.navigate({
      name: 'EmployeeDetail'
    }))
  };

  const onPressOption = (index: number) => {
    switch (index) {
      case 0:
        handleViewDetail();
        break;
      case 1:
        handleEditEmployee();
        break;
      case 2:
        handleDeleteEmployee();
        break;
      default:
        break;
    }
  };

  const { mutate: removeEmployee } = useMutation('', () => {
    if (selectedEmployee) {
      const id = selectedEmployee.uuid;
      return employeesService.delete(id);
    } else {
      return Promise.reject('Employee not selected');
    }
  },
    {
      onSuccess: () => {
        cache.invalidateQueries('employees');
      },
      onError: (err) => {
        Alert.alert('Error', '', [
          {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel'
          },
          {
            text: 'Try Again',
            onPress: () => {
              handleDeleteEmployee();
            }
          }
        ]);
      }
    }
  );

  const [pageToFetch, setPageToFetch] = useState(1);

  const actionSheet = useRef<ActionSheet>(null);

  const {
    data: employeesResponse,
    isFetching,
    error: fetchError,
    isRefetching,
    refetch
  } = useQuery<IEmployeesResponse, Error>(
    'employees',
    () => employeesService.getAll({
      page: pageToFetch
    })
  );

  const prevPage = () => {
    if (pagesState.current === 1) {
      return;
    }
    setPageToFetch(pagesState.current - 1);
    setTimeout(() => {
      refetch();
    }, 200);
  };

  const nextPage = () => {
    if (pagesState.current === pagesState.total) {
      return;
    }
    setPageToFetch(pagesState.current + 1);
    setTimeout(() => {
      refetch();
    }, 200);
  };

  const renderPagination = useMemo(() => {
    const { current, total } = pagesState;
    return (
      <View
        style={styles.paginationWrapper}
      >
        <View style={styles.pagination}>
          <Pressable
            disabled={current === 1 || isFetching}
            onPress={prevPage}
          >
            <FaIcon name='chevron-left' size={20} color={(current > 1 && !isFetching) ? 'black' : 'gray'} />
          </Pressable>
          <Text>{`${current} / ${total}`}</Text>
          <Pressable
            disabled={current === total || isFetching}
            onPress={nextPage}
          >
            <FaIcon name='chevron-right' size={20} color={(current < total && !isFetching) ? 'black' : 'gray'} />
          </Pressable>
        </View>
      </View>

    );
  }, [pagesState]);

  const renderHeader = () => (
    <View
      style={styles.tableHeader}
    >
      <Text style={styles.cell}>Full Name</Text>
      <Text style={styles.cell}>Department</Text>
    </View>
  );

  const renderItem = (props: { item: IEmployee }) => {
    const { item } = props;
    return (
      <Pressable
        style={[styles.row,
        {
          backgroundColor: (selectedEmployee && selectedEmployee.uuid === item.uuid) ?
            '#f5f5f5' :
            '#fff'
        }
        ]}
        onPress={() => {
          if (actionSheet.current) {
            setState((prevState: AppContextState) => ({
              ...prevState,
              selectedEmployee: item
            }));
            actionSheet.current.show();
          }
        }}
      >
        <Text style={styles.cell}>{
          `${item.first_name ?? 'N/A'} ${item.last_name ?? 'N/A'}`
        }</Text>
        <Text style={styles.cell}>{item.department ?? ''}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    if (employeesResponse?.meta && employeesResponse?.meta.current_page !== null) {
      setPagesState((prevState) => ({
        ...prevState,
        current: employeesResponse.meta.current_page ? employeesResponse.meta.current_page : 0,
        total: Math.ceil(employeesResponse.meta.total / employeesResponse.meta.per_page)
      }));
    } else {
      refetch();
    }
  }, [employeesResponse]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Employees',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {
        fetchError ?
          (
            <Text>{fetchError?.message}</Text>
          ) :
          (
            <>
              <FlatList
                ListHeaderComponent={renderHeader}
                data={employeesResponse?.data ?? []}
                renderItem={renderItem}
                initialNumToRender={5}
                keyExtractor={(item) => item.uuid}
                ListFooterComponent={renderPagination}
              />
              {
                (isRefetching || isFetching) &&
                (
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <Text>{isFetching ? 'Loading...' : 'Updating...'}</Text>
                    <ActivityIndicator />
                  </View>
                )
              }
              <Pressable
                style={{
                  height: 40,
                  width: appWidth - 10,
                  marginHorizontal: 5,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={isFetching || isRefetching}
                onPress={() => {
                  navigation.dispatch(CommonActions.navigate({
                    name: 'EmployeeCreateUpdate',
                    params: {
                      operation: 'create',
                    }
                  }));
                }}
              >
                <Text
                  style={{
                    height: 30,
                    fontSize: 20,
                    color: 'dimgray',
                    margin: 10,
                    fontWeight: 'bold'
                  }}
                >
                  Create
                </Text>
                <FaIcon name='plus' size={24} color='dimgray' />
              </Pressable>

              <ActionSheet
                ref={actionSheet}
                title={'SELECT AN OPERATION'}
                options={optionArray}
                cancelButtonIndex={3}
                destructiveButtonIndex={2}
                onPress={onPressOption}
              />
            </>
          )
      }

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  paginationWrapper: {
    height: 40,
    width: appWidth,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  pagination: {
    height: 40,
    width: 200,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  tableHeader: {
    backgroundColor: 'lightgray',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cell: {
    width: (appWidth - 10) / 2,
    paddingLeft: 10,
    height: 20,
  }
});

