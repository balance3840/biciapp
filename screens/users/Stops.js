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
import axios from "axios";
import { AsyncStorage } from 'react-native';

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

  sanitizeString(stop) {
    const parts = stop.split("_");
    let resultString = "";
    parts.map((part, index) => {
      if (index > 0) {
        resultString += `${part} `;
      }
    });
    return resultString;
  }

  async gotoDetail(stop) {
      const { navigation } = this.props;
      await AsyncStorage.setItem("currentStop", JSON.stringify(stop));
      navigation.navigate("Stop", { stop: stop });
  }

  render() {
    const { stops } = this.state;
    const { navigation } = this.props;
    return (
      <Container>
        <Content>
          {stops &&
            stops.features.map(stop => (
              <Card onTouchEnd={() => this.gotoDetail(stop)} key={stop.properties.number}>
                <CardItem header>
                  <Text>{this.sanitizeString(stop.properties.name)}</Text>
                </CardItem>
                <CardItem>
                  <Icon
                    active
                    style={{ color: "#5e92f3", marginTop: 10 }}
                    name="bicycle"
                  />
                  <Badge style={{ marginTop: 10, marginLeft: 5 }}>
                    <Text>
                      {stop.properties.free}/{stop.properties.total}
                    </Text>
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
