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
import Loading from "../../common/components/Loading";

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
      .get("https://apunterd.com/paradas.json")
      .then(function (response) {
        self.setState({ stops: response.data.features });
      })
      .catch(function (error) {
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

  renderLoading() {
    return (
      <Loading />
    )
  }

  renderContent() {
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
    )
  }

  render() {
    const { stops } = this.state;
    return (
      stops ? this.renderContent() : this.renderLoading()
    );
  }
}

export default StopsScreen;
