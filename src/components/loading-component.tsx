import { ActivityIndicator, StyleSheet, View, Text } from 'react-native'
import React from 'react'

const Loading = (props: { message?: string }) => {
  return (
    <View
      style={styles.container}
    >
      {
        props.message &&
        (<Text
          style={styles.message}
        >{props.message}</Text>)
      }
      <ActivityIndicator size={'large'} color={'darkgray'} />
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});