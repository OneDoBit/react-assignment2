import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button} from 'react-native';
import { Icon } from 'native-base';

import firebase from './firebase' 

export default class aboutScreen extends React.Component {

  carDatabase = firebase.database().ref('car');

  state = {cars:{}, selectedId: '', text: '', newItem: ''}

  componentDidMount(){
    this.carDatabase.on('value', cars  =>{
      const carsJSON = cars.val();
      this.setState({cars:carsJSON === null ? {}:carsJSON})
    })

  }
    create(){
      this.carDatabase.push({item: this.state.newItem});
      this.setState({newText: ''})
    }

    update(){
      this.carDatabase.child(this.state.selectedId).set({item: this.state.text})
      this.setState({text: ''})
    }

    deleteCar(){
      if(this.state.selectedId === ''){
        return;
      }
      this.carDatabase.child(this.state.selectedId)
      .set(null)
      this.setState({selectedId: ''})
    }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.TextInput}>
          <TextInput placeholderTextColor={'white'} placeholder="Type here to update your item!" onChangeText={(text) => this.setState({text})} value={this.state.text}/>
        </View>
        {
          Object.keys(this.state.cars).map( (carId, index)=> 
          <TouchableOpacity key={index} onPress={() => this.setState({selectedId: carId})} style={{flexDirection: 'row',}}>
            <Icon style={styles.Icon} name="close-circle-outline" onPress={() => this.setState({selectedId: carId}, ()=> {this.deleteCar()})}/>
            <Text style={styles.Text}>{`${JSON.stringify(this.state.cars[carId])}`}</Text>
            <Icon style={styles.Icon} name="brush" onPress={() => this.setState({selectedId: carId},()=> {this.update()})}/>
          </TouchableOpacity>
          )
        }
        
        <View style={styles.TextInput}>
          <TextInput placeholderTextColor={'white'} placeholder="Type here to create your item!" onChangeText={(newItem) => this.setState({newItem})} value={this.state.newItem}/>
          <Icon style={styles.Icon} name="add-circle" onPress={() => this.create()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Icon:{
    marginLeft: 5,
    marginRight: 5,
    color: '#fff',
  },
  TextInput:{
    backgroundColor:'#9ED2FF',
    height: 30,
    flexDirection: 'row',
    color: 'white',
    borderStyle: 'solid',
    borderRadius: 25,
    margin: 30,
  },
  Text:{
    backgroundColor:'#C4CBFE',
    color: 'white',
    borderStyle: 'solid',
    borderRadius: 25,
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#CEE1FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
