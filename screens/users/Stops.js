import React, { Component } from "react";
import {
  Container,
  Text,
  Content,
  Body,
  Card,
  CardItem,
  Icon,
  Badge
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { AsyncStorage } from "react-native";
import { sanitizeString, getBadgeColor } from "../../helpers";

class StopsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: null
    };
    this.gotoDetail = this.gotoDetail.bind(this);
  }

  componentDidMount() {
    var self = this;
    axios
      .get("https://api.myjson.com/bins/167krs")
      .then(function(response) {
        console.log(response.data);
        self.setState({ stops: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  async gotoDetail(stop) {
    const { navigation } = this.props;
    await AsyncStorage.setItem("currentStop", JSON.stringify(stop));
    navigation.navigate("Stop", {
      stop: stop,
      title: sanitizeString(stop.properties.name)
    });
  }

  render() {
    const { stops } = this.state;
    return (
      <Container>
        <Content>
          {stops &&
            stops.features.map(stop => (
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
                      getBadgeColor(
                        stop.properties.available,
                        stop.properties.total
                      ) === "warning"
                        ? true
                        : false
                    }
                    success={
                      getBadgeColor(
                        stop.properties.available,
                        stop.properties.total
                      ) === "success"
                        ? true
                        : false
                    }
                    danger={
                      getBadgeColor(
                        stop.properties.available,
                        stop.properties.total
                      ) === "danger"
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
                      getBadgeColor(
                        stop.properties.free,
                        stop.properties.total
                      ) === "warning"
                        ? true
                        : false
                    }
                    success={
                      getBadgeColor(
                        stop.properties.free,
                        stop.properties.total
                      ) === "success"
                        ? true
                        : false
                    }
                    danger={
                      getBadgeColor(
                        stop.properties.free,
                        stop.properties.total
                      ) === "danger"
                        ? true
                        : false
                    }
                    style={{ marginTop: 10, marginLeft: 5 }}
                  >
                    <Text>{stop.properties.free}</Text>
                  </Badge>
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

export default StopsScreen;
