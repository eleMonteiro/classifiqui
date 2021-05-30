import React from 'react';
import { StyleSheet, View } from 'react-native';

import Router from './components/routes/Router'

import GlobalStateUser from './context/user/GlobalStateUser';

export default function App() {
  return (
    <GlobalStateUser>
      <View style={styles.container}>
        <Router />
      </View>
    </GlobalStateUser>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#feddc7'
  },
});