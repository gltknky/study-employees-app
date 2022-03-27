import React, { useContext } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/app-context';
import FaIcon from '@expo/vector-icons/FontAwesome';

const { width: appWidth } = Dimensions.get('window');

const EmployeeDetailScreen = () => {
  const navigation = useNavigation();
  const { state: { selectedEmployee }, setState } = useContext(AppContext);
  return (
    <SafeAreaView
      style={styles.container}
    >
      {
        selectedEmployee &&
        (
          <View style={styles.container}>

            <View style={styles.row}>
              <Text style={styles.label}>First Name :</Text>
              <Text style={styles.text}>{selectedEmployee.first_name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Last Name :</Text>
              <Text style={styles.text}>{selectedEmployee.last_name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Department :</Text>
              <Text style={styles.text}>{selectedEmployee.department}</Text>
            </View>
          </View>
        )
      }
      <Pressable
        style={styles.closeButton}
        onPress={() => {
          navigation.dispatch(CommonActions.goBack());
        }}
      >
        <FaIcon name='arrow-left' size={24} color='dimgray' />
        <Text
          style={{
            height: 30,
            fontSize: 20,
            color: 'dimgray',
            margin: 10,
            fontWeight: 'bold'
          }}
        >
          Back
        </Text>
      </Pressable>
    </SafeAreaView>
  )
};

export default EmployeeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 50,
  },
  label: {
    fontSize: 18,
    color: '#222',
    width: 110,
    textAlign: 'right',
  },
  text: {
    fontSize: 18,
    color: '#444',
    width: appWidth - 130,
    paddingLeft: 20,
  },
  closeButton: {
    height: 40,
    width: appWidth - 10,
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#222',
  }
});