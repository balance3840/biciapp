import React, { Component } from "react";
import { Container, Content, List, ListItem, Text } from "native-base";

class StopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  componentDidMount() {
      console.log(this.props);
  }

  render() {
    const { stop } = this.props.route.params;
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>Nombre</Text>
            </ListItem>
            <ListItem>
              <Text>{this.sanitizeString(stop.properties.name)}</Text>
            </ListItem>
            <ListItem itemDivider>
              <Text>Ubicación</Text>
            </ListItem>
            <ListItem>
              <Text>{stop.properties.address}</Text>
            </ListItem>
            <ListItem itemDivider>
              <Text>Disponibles</Text>
            </ListItem>
            <ListItem>
              <Text>{stop.properties.free}</Text>
            </ListItem>
            <ListItem itemDivider>
              <Text>Total</Text>
            </ListItem>
            <ListItem>
              <Text>{stop.properties.total}</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default StopScreen;
