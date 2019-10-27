import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DataSheet from '../lib/DataSheet.js';

export default class ListView extends React.Component {
  state = { data: [] }

  componentDidMount() { DataSheet.registerViewController(this); }

  render() {
    return (
      <View style={styles.container}>
        <View style={StyleSheet.compose(styles.product, styles.header)}>
          <Text style={{...styles.name, color: 'white', fontWeight: 'bold'}}>Total</Text>
          <Text style={{...styles.price, color: 'white', fontWeight: 'bold'}}>${Number.parseFloat(DataSheet.cumsum).toFixed(2)}</Text>
        </View>
        <FlatList
          style={{backgroundColor: '#F7F7F7'}}
          data={this.state.data}
          renderItem={({ item, index }) => {
            if(!item.Name) return (
              <TouchableOpacity style={styles.product} onPress={_ => DataSheet.remove(index)}>
                <Text style={styles.name}>{item.data}</Text>
              </TouchableOpacity>
            )
            return <Product data={item} index={index}/>
          }}
          keyExtractor={(item, i) => `${i}`}
          onRefresh={_ => DataSheet.refresh()}
          refreshing={DataSheet.refreshing}
        />
      </View>
    )
  }
}

const Product = ({data, index}) => (
  <TouchableOpacity style={styles.product} onPress={_ => Alert.alert(data.Name + index, `$${Number.parseFloat(data.Price).toFixed(2)}`, [
    {text: 'Remove', onPress: _ => DataSheet.remove(index)},
    {text: 'Buy Another', onPress: _ => DataSheet.another(index)},
    {text: 'Cancel', onPress: _ => {}}
  ])}>
    <Text style={styles.name}>{data.Name}</Text>
    <Text style={styles.price}>{Number.parseFloat(data.Price).toFixed(2)}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 9,
    flexDirection: 'column',
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    paddingTop: Expo.Constants.statusBarHeight
  },
  header: {
    backgroundColor: "#51b948",
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  product: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderBottomColor: '#CCC',
    borderRightColor: '#CCC',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderRadius: 4
  },
  name: {
    fontSize: 30,
    flex: 7
  },
  price: {
    fontSize: 30,
    flex: 3,
    textAlign: 'right'
  }
})
