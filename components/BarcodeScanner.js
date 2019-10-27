import * as React from 'react';
import { Alert, Text, View, StyleSheet, Button, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';
import DataSheet from '../lib/DataSheet.js';

export default class BarcodeScanner extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  constructor(props){ super(props); }

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null)
      return <></>;
    if (hasCameraPermission === false)
      return (
        <TouchableWithoutFeedback onPress={this.props.closeOp}>
          <View style={styles.container}>
            <Text style={styles.errorText}>Need camera access.</Text>
            <Text style={styles.errorText}>Please fix in settings</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.hr}/>
        <View style={styles.vr}/>
      </View>
    );
  }

  handleBarCodeScanned = data => {
    this.setState({ scanned: true });

    dismiss = (add, cb) => {
      if(add) DataSheet.push(data);
      this.setState({ scanned: false })
      if(cb) cb(data);
    }

    Alert.alert('Item scanned!', `Barcode ID: ${data.data}`, [
      {text: 'Cancel', onPress: _ => dismiss(false)},
      {text: 'Confirm', onPress: _ => dismiss(true)}
    ]);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 9,
    flexDirection: 'column',
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center'
  },
  errorText: {
    fontSize: 30,
    textAlign: 'center'
  },
  hr: {
    position: 'absolute',
    left: '10%',
    top: '50%',
    width: '80%',
    height: 0,
    borderWidth: 1,
    borderColor: 'red'
  }
})
