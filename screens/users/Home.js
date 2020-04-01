import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "native-base";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { AppLoading } from "expo";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    const deltas = this.calculateDeltas();
    let location;
    if (status === "granted") {
      location = await Location.getCurrentPositionAsync({});
    } else {
      location = {
        coord: {
          latitude: 37.78825,
          longitude: -122.4324
        }
      };
    }
    this.setState({ location: { ...location, deltas } });
  };

  calculateDeltas() {
    const latitudeDelta = 0.004757;
    const longitudeDelta = 0.006866;
    const coef = latitudeDelta / longitudeDelta;
    const longitudeDeltaCalculated = this.calcLongitudeDelta(15.20);
    const latitudeDeltaCalculated = longitudeDeltaCalculated * coef;
    return {
      longitudeDelta: longitudeDeltaCalculated,
      latitudeDelta: latitudeDeltaCalculated
    };
  }

  calcZoom(longitudeDelta) {
    return Math.log(360 / longitudeDelta) / Math.LN2;
  }

  calcLongitudeDelta(zoom) {
    var power = Math.log2(360) - zoom;
    return Math.pow(2, power);
  }

  renderLoading() {
    return <AppLoading />;
  }

  renderContent() {
    return (
      <View>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: this.state.location.deltas.latitudeDelta,
            longitudeDelta: this.state.location.deltas.longitudeDelta
          }}
        />
        <Button onPress={() => this.props.navigation.navigate("Stops")}>
          <Text>Ver listado de paradas</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { location } = this.state;
    return location ? this.renderContent() : this.renderLoading();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100
  }
});

export default HomeScreen;
