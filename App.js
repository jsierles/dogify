import React from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

// Native-like cross platform navigation
import { StackNavigator } from 'react-navigation';

// A best practice: always wrap simple built-in components
// to allow customization and avoid search/replace refactoring later.
// Here it's used for add a capitalization feature.

function capitalize(text) {
  return text.slice(0,1).toUpperCase() + text.slice(1, text.length);
}

const DogText = (props) => {
  let text = props.children;
  if (props.caps) {
    text = capitalize(text);
  }

  return <Text {...props}>{text}</Text>;
}

class BreedList extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.title : 'Dogify: Breeds',
    }
  };

  // Set initial state, to be updated by the network fetch when the component mounts

  state = {
    breeds: []
  };

  // Fetch breeds using async/await for readability.
  // Shape breed data into an array suitable for passing to FlatList

  async _fetchBreeds() {
    let response = await fetch("https://dog.ceo/api/breeds/list/all");
    let responseJson = await response.json();
    let breeds = Object.keys(responseJson.message).map((name) => {
      return {name: name, types: responseJson.message[name]};
    });
    this.setState({breeds: breeds});
  }

  // Only fetch breeds if this component is not being used at the second navigation level.

  componentWillMount() {
    if (!this.props.breeds) {
      this._fetchBreeds();
    }
  }

  _onPress = (breed) => {
    if (breed.types && breed.types.length > 0) {
      this.props.navigation.navigate('Types', {breeds: breed.types, title: `Dogify: ${capitalize(breed.name)} Types`});
    }
  }

  // Only render the navigation arrow when there are breed subtypes

  _renderArrow(item) {
    if (item.types && item.types.length > 0) return <DogText style={styles.arrow}>></DogText>;
  }

  _renderBreed = ({item}) => {
    return (
      <TouchableHighlight
        onPress={() => this._onPress(item)}>
        <View style={styles.breedRow}>
          <DogText caps style={styles.breedText}>{item.name ? item.name : item}</DogText>
          {this._renderArrow(item)}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    let { params } = this.props.navigation.state;

    // Render top level breeds unless we are being passed an explicit list of breeds.
    let breeds = params ? params.breeds : this.state.breeds;

    return (
        <FlatList
          data={breeds}
          renderItem={this._renderBreed}
          keyExtractor={(item, index) => item.name || item}
        />
    );
  }
}

// Setup two navigation levels for top level breeds and breed types, but reuse the component for displaying them

export default StackNavigator(
  {
    Breeds: {
      screen: BreedList,
    },
    Types: {
      screen: BreedList
    }
  },
  {
    initialRouteName: 'Breeds',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  breedRow: {
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  breedText: {
    fontSize: 18
  },
  arrow: {
    fontWeight: "bold",
    fontSize: 20
  }
});
