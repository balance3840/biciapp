import React, { Component } from "react";
import {
  Card,
  CardItem,
  Text,
  Icon,
  Badge,
  Body,
  Content,
  Container
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { sanitizeString, getBadgeColor } from "../../helpers";
import { AsyncStorage } from "react-native";
import utmObj from "utm-latlng";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import getDistance from "geolib/es/getDistance";

class NearestStops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: null,
      location: null
    };
  }

  async componentDidMount() {
    await this.getLocation();
    this.getStops();
  }

  async gotoDetail(stop) {
    const { navigation } = this.props;
    await AsyncStorage.setItem("currentStop", JSON.stringify(stop));
    navigation.navigate("Stop", {
      stop: stop,
      title: sanitizeString(stop.properties.name)
    });
  }

  getStops = () => {
    var self = this;
    axios
      .get("https://apunterd.com/paradas.json")
      .then(function(response) {
        let stops = response.data.features;
        let utm = new utmObj();
        stops.map(stop => {
          let points = utm.convertUtmToLatLng(
            stop.geometry.coordinates[0],
            stop.geometry.coordinates[1],
            30,
            "S"
          );
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
        stops.sort((a,b) => { return a.distance - b.distance });
        const nearestStops = stops.slice(0, 5);
        self.setState({ stops: nearestStops });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

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

  render() {
    const { stops } = this.state;
    return (
      <Container>
        <Content>
          {stops &&
            stops.map(stop => (
              <Card
                onTouchEnd={() => this.gotoDetail(stop)}
                key={stop.properties.number}
              >
                <CardItem header>
                  <Text>{sanitizeString(stop.properties.name)}</Text>
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
                      getBadgeColor(stop.properties.available) === "warning"
                        ? true
                        : false
                    }
                    success={
                      getBadgeColor(stop.properties.available) === "success"
                        ? true
                        : false
                    }
                    danger={
                      getBadgeColor(stop.properties.available) === "danger"
                        ? true
                        : false
                    }
                  >
                    <Text>{stop.properties.available}</Text>
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
                      getBadgeColor(stop.properties.free) === "warning"
                        ? true
                        : false
                    }
                    success={
                      getBadgeColor(stop.properties.free) === "success"
                        ? true
                        : false
                    }
                    danger={
                      getBadgeColor(stop.properties.free) === "danger"
                        ? true
                        : false
                    }
                    style={{ marginTop: 10, marginLeft: 5 }}
                  >
                    <Text>{stop.properties.free}</Text>
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
                    <Text style={{ marginTop: 10 }}>{this.getDistanceUnit(stop.distance).distance} {this.getDistanceUnit(stop.distance).unit}</Text>
                </CardItem>
                <CardItem footer>
                  <Body>
                    <Text>{stop.properties.address}</Text>
                  </Body>
                </CardItem>
              </Card>
            ))}
        </Content>
      </Container>
    );
  }
}

export default NearestStops;
