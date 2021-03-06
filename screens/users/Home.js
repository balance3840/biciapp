import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, AsyncStorage, Alert } from "react-native";
import {
  Body,
  Card,
  CardItem,
  Icon,
  Badge
} from "native-base";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { AppLoading } from "expo";
import utmObj from "utm-latlng";
import axios from "axios";
import bikeIcon from "../../assets/bike_icon.png";
import { sanitizeString, getBadgeColor } from "../../helpers";
import { MaterialIcons } from "@expo/vector-icons";
import getDistance from "geolib/es/getDistance";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      stops: null,
      currentStop: null,
      username: ''
    };
  }

  async componentDidMount() {
    const username = await this.getUser();
    this.showWelcomeMessage(username);
    this.getLocation();
    this.getStops();
  }

  getUser = async () => {
    const username = await AsyncStorage.getItem("username");
    if (username) {
      this.setState({ username });
    }
    return username;
  }

  showWelcomeMessage(username) {
    Alert.alert("Bienvenido", `Hola ${username}, bienvenido a Go Bici.`);
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
    await this.setState({ location: { ...location, deltas } });
  };

  getStops = () => {
    var self = this;
    axios
      .get("https://apunterd.com/paradas.json")
      .then(function (response) {
        let stops = response.data.features;
        let utm = new utmObj();
        stops.map(stop => {
          let points = utm.convertUtmToLatLng(
            stop.geometry.coordinates[0],
            stop.geometry.coordinates[1],
            30,
            "S"
          );
          stop.location = {
            latitute: points.lat && Number(points.lat) ? Number(points.lat) : 0,
            longitude: points.lng && Number(points.lng) ? Number(points.lng) : 0
          };
          let currentLocation = {
            lat: self.state.location.coords.latitude,
            lon: self.state.location.coords.longitude
          };
          const distance = getDistance(currentLocation, {
            lat: Number(points.lat),
            lon: Number(points.lng)
          });
          stop.distance = distance;
        });
        self.setState({ stops });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  calculateDeltas() {
    const latitudeDelta = 0.004757;
    const longitudeDelta = 0.006866;
    const coef = latitudeDelta / longitudeDelta;
    const longitudeDeltaCalculated = this.calcLongitudeDelta(15.2);
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

  renderMarkers() {
    const { stops } = this.state;
    const utm = new utmObj();
    return (
      <View>
        {stops &&
          stops.map(stop => {
            const coordinate = {
              latitude: stop.location.latitute,
              longitude: stop.location.longitude
            };
            return (
              <Marker
                key={stop.properties.number}
                coordinate={coordinate}
                image={bikeIcon}
                onPress={() => this.setState({ currentStop: stop })}
              />
            );
          })}
      </View>
    );
  }

  gotoDetail = async stop => {
    const { navigation } = this.props;
    await AsyncStorage.setItem("currentStop", JSON.stringify(stop));
    navigation.navigate("Stop", {
      stop: stop,
      title: sanitizeString(stop.properties.name)
    });
  };

  getDistanceUnit(distance) {
    let unit = "m";
    const kms = (distance / 1000).toFixed(2);
    if(kms >= 1) {
        distance = kms;
        unit = "km";
    }
    return {
        unit,
        distance
    }
}

  renderStop() {
    const { currentStop } = this.state;
    return (
      <View
        style={{ position: 'absolute', bottom: 6, width: '100%' }}
      >
        {currentStop && (
          <Card
            onTouchEnd={() => this.gotoDetail(currentStop)}
            key={currentStop.properties.number}
            style={{ marginBottom: 0, marginLeft: 0, marginRight: 0 }}
          >
            <CardItem header>
              <Text>{sanitizeString(currentStop.properties.name)}</Text>
            </CardItem>
            <CardItem>
              <Icon
                active
                style={{ color: "#5e92f3", marginTop: 10 }}
                name="bicycle"
              />
              <Badge
                style={{ marginTop: 10 }}
                warning={
                  getBadgeColor(currentStop.properties.available) === "warning"
                    ? true
                    : false
                }
                success={
                  getBadgeColor(currentStop.properties.available) === "success"
                    ? true
                    : false
                }
                danger={
                  getBadgeColor(currentStop.properties.available) === "danger"
                    ? true
                    : false
                }
              >
                <Text style={{ paddingTop: 3, color: "#ffffff" }}>
                  {currentStop.properties.available}
                </Text>
              </Badge>
              <MaterialIcons
                name="local-parking"
                style={{
                  fontSize: 20,
                  marginTop: 10,
                  marginLeft: 20,
                  color: "#5e92f3"
                }}
              />
              <Badge
                warning={
                  getBadgeColor(currentStop.properties.free) === "warning"
                    ? true
                    : false
                }
                success={
                  getBadgeColor(currentStop.properties.free) === "success"
                    ? true
                    : false
                }
                danger={
                  getBadgeColor(currentStop.properties.free) === "danger"
                    ? true
                    : false
                }
                style={{ marginTop: 10, marginLeft: 5 }}
              >
                <Text style={{ paddingTop: 3, color: "#ffffff" }}>
                  {currentStop.properties.free}
                </Text>
              </Badge>
              <MaterialIcons
                name="place"
                style={{
                  fontSize: 20,
                  marginTop: 10,
                  marginLeft: 20,
                  color: "#5e92f3"
                }}
              />
                <Text style={{ marginTop: 10 }}>{this.getDistanceUnit(currentStop.distance).distance} {this.getDistanceUnit(currentStop.distance).unit}</Text>
            </CardItem>
            <CardItem footer>
              <Body>
                <Text>{currentStop.properties.address}</Text>
              </Body>
            </CardItem>
          </Card>
        )}
      </View>
    );
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
          showsUserLocation={true}
          followUserLocation={true}
        >
          {this.renderMarkers()}
        </MapView>
        {this.renderStop()}
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
