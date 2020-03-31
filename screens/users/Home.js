import React, { Component } from "react";
import { View, Text } from "react-native";
import { Button } from "native-base";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>This is the HomeScreen!</Text>
        <Button onPress={() => this.props.navigation.navigate("Stops")}>
          <Text>Ver listado de paradas</Text>
        </Button>
      </View>
    );
  }
}

export default HomeScreen;
