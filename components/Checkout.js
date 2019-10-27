import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DataSheet from '../lib/DataSheet.js';
import Barcode from 'react-native-barcode-builder';

export default class Checkout extends React.Component {
  state = { barcode: null }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DataSheet.sendOrderRequest().then(barcode => this.setState({barcode}))
  }

  render() {
    if (this.state.barcode === null)
      return (
        <View style={styles.container}>
          <Text style={styles.largeText}>Generating your checkout barcode</Text>
          <ActivityIndicator size="large" color="#51b948" style={{margin: 20}} />
          <Text style={styles.largeText}>Your total: ${Number(DataSheet.cumsum).toFixed(2)}</Text>
        </View>
      )
    else return (
      <View style={styles.container}>
        <Barcode value={this.state.barcode} format="CODE128"/>
        <Text style={styles.largeText}>Your total: ${Number(DataSheet.cumsum).toFixed(2)}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={_ => this.props.closeOp(true)}>
          <Text style={styles.largeText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={_ => this.props.closeOp(false, this.state.barcode)}>
          <Text style={styles.largeText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: width,
    width: height,
    justifyContent: 'center',
    flexDirection: 'column',
    transform: [
      { rotate: '90deg' },
      { translateX: (height - width)/2 },
      { translateY: (height - width)/2 }
    ]
  },
  largeText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    right: 80,
    backgroundColor: '#6c6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  cancelButton: {
    position: 'absolute',
    bottom: 30,
    left: 80,
    backgroundColor: '#c66',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  }
})
