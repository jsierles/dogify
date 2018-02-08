import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default class App extends React.Component {
  state = {
    breeds: []
  };

  async _fetchBreeds() {
    let response = await fetch("https://dog.ceo/api/breeds/list/all");
    let responseJson = await response.json();
    let breeds = Object.keys(responseJson.message).map((name) => {
      return {name: name, types: responseJson.message[name]};
    });
    this.setState({breeds: breeds});
  }

  componentWillMount() {
    this._fetchBreeds();
  }

  _renderBreed({item, separators}) {
    return (
      <TouchableHighlight
        style={styles.breed}
        onPress={() => this._onPress(item.name)}>
        <View>
          <Text>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.container}
          data={this.state.breeds}
          renderItem={this._renderBreed}
          keyExtractor={(item, index) => item.name}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 24
  },
  breed: {
    paddingVertical: 10,
    borderBottomWidth: 1
  }
});
