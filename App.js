import React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { BarcodeScanner, Checkout, ListView } from './components';
import Svg from 'react-native-svg-uri';
import BarcodeSVG from './assets/barcode.svg';
import DataSheet from './lib/DataSheet.js';

export default class App extends React.Component {
  state = { scanning: false, checkout: false };

  constructor(props) {
    super(props);
    this.handleScannerClose = this.handleScannerClose.bind(this);
    this.handleCheckoutClose = this.handleCheckoutClose.bind(this);
  }

  handleScannerClose() { this.setState({scanning: false}); }
  handleCheckoutClose(completed, uuid) {
    this.setState({checkout: false});
    if(completed) DataSheet.clear();
    else DataSheet.void(uuid);
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.scanning}
          animationType='fade'
        >
          <BarcodeScanner closeOp={this.handleScannerClose}/>
          <View style={styles.footer}>
            <View style={styles.footerSide}/>
            <TouchableHighlight style={styles.footerMain} underlayColor="#61c958" onPress={_ => this.setState({ scanning: false })}>
              <Icon name="list" iconStyle={styles.main}/>
            </TouchableHighlight>
            <View style={styles.footerSide}/>
          </View>
        </Modal>
        <Modal
          visible={this.state.checkout}
          animationType="fade"
        >
          <Checkout closeOp={this.handleCheckoutClose}/>
        </Modal>
        <ListView/>
        <View style={styles.footer}>
          <TouchableHighlight style={styles.footerSide} underlayColor="#61c958" onPress={_ => Alert.alert(
            "Are you sure you want to empty your cart?",
            "This action cannot be undone",
            [
              {text: "No", onPress: _ => {}},
              {text: "Yes, I'm sure", onPress: _ => DataSheet.clear()}
            ])
          }>
            <Icon name='delete' iconStyle={styles.icon}/>
          </TouchableHighlight>
          <TouchableHighlight style={styles.footerMain} underlayColor="#f5ffeb" onPress={_ => this.setState({ scanning: true })}>
            <Svg width="96" height="60" source={BarcodeSVG} fill="#51b948" fillAll={true}/>
          </TouchableHighlight>
          <TouchableHighlight style={styles.footerSide} underlayColor="#61c958" onPress={_ => Alert.alert(
            "Proceed to Checkout?",
            `Total: $${Number.parseFloat(DataSheet.cumsum).toFixed(2)}`,
            [
              {text: "No", onPress: _ => {}},
              {text: "Yes, I'm sure", onPress: _ => this.setState({checkout: true})}
            ])}
          >
            <Icon name='payment' iconStyle={styles.icon}/>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  footer: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#51b948',
    position: 'relative'
  },
  footerSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    color: 'white',
    fontSize: 60
  },
  footerMain: {
    top: -50,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
    borderColor: "#51b948",
    borderWidth: 2,
    height: 100,
    width: 100,
  },
  main: {
    fontSize: 60,
  }
});
