import React, { Component } from "react";
import {
  Item,
  Input,
  Text,
  Button
} from "native-base";
import { Image, View, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import logo from "../../assets/logo.png";
import { AsyncStorage } from 'react-native';

export default class LoginScreen extends Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      username: ""
    };
    this.onLoginPressed = this.onLoginPressed.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font
    });
    this.setState({ isReady: true });
  }

  async onLoginPressed() {
    try {
        await AsyncStorage.setItem('username', this.state.username);
        this.props.navigation.navigate("TabNavigator");
      } catch (error) {
          ;
      }
  }

  render() {
    const remote =
      "https://www.jakpost.travel/wimages/large/84-849185_baixar-wallpaper-bicicleta-bicicleta-freeride-papis-downhill-mountain.jpg";
    if (this.state.isReady) {
      return (
        <ImageBackground
          style={{
            backgroundColor: "#ccc",
            flex: 1,
            resizeMode: "center",
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
          source={{ uri: remote }}
        >
          <View
            style={{
              paddingTop: 60,
              paddingLeft: 20,
              paddingRight: 20,
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={{
                uri: "https://cdn.bimbimbikes.com/images/bike-lg.png?v1.1.18"
              }}
              style={{ width: 200, height: 200 }}
            />
            <Item regular>
              <Input
                placeholder="Nombre de usuario"
                style={{ backgroundColor: "#ffffff" }}
                onChangeText={(value) => this.setState({  username: value })}
              />
            </Item>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Button
              style={{
                marginTop: 40,
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
              disabled={this.state.username ? false :  true}
              onPress={this.onLoginPressed}
            >
              <Text>LOGIN</Text>
            </Button>
          </View>
        </ImageBackground>
      );
    } else {
      return <AppLoading />;
    }
  }
}
