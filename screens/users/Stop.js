import React, { Component } from "react";
import { Container, Content, List, ListItem, Text, Button, Icon } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

class StopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true,
      localUri: ''
    };
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

  renderLoading() {
    return (
      <Text>Cargando...</Text>
    )
  }

  async openImagePickerAsync() {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Se debe autorizar el uso de la galeria de imagenes");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    this.setState({ localUri: pickerResult.uri });

    if (!(await Sharing.isAvailableAsync())) {
      alert(`Esta funcionalidad no esta disponible en su plataforma`);
      return;
    }

    Sharing.shareAsync(this.state.localUri);

  }

  renderContent() {
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
              <Text>{stop.properties.available}</Text>
            </ListItem>
            <ListItem itemDivider>
              <Text>Huecos</Text>
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
          <Button iconLeft onPress={() => this.openImagePickerAsync()} style={{ marginTop: 30, marginHorizontal: 15, alignContent: "center", justifyContent: "center" }}>
            <Icon name="camera" />
            <Text>Compartir foto</Text>
          </Button>
        </Content>
      </Container>
    )
  }

  render() {
    const { ready } = this.state;
    return (
      ready ? this.renderContent() : this.renderLoading()
    );
  }
}

export default StopScreen;
