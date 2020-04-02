import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/guests/Login";
import HomeScreen from "./screens/users/Home";
import { AsyncStorage, Share } from "react-native";
import { AppLoading } from "expo";
import StopsScreen from "./screens/users/Stops";
import StopScreen from "./screens/users/Stop";
import { Icon } from "native-base";
import { sanitizeString } from "./helpers";
import NearestStops from "./screens/users/NearestStops";
import TabNavigator from "./navigators/TabNavigator";

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: "#1565c0"
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold"
  },
  headerMode: "none"
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      isReady: false
    };
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value) {
        this.setState({ authenticated: true });
      }
    } catch (error) {}
    this.setState({ isReady: true });
  }

  async onSharePressed() {
    let stop = await AsyncStorage.getItem("currentStop");
    stop = JSON.parse(stop);
    const name = sanitizeString(stop.properties.name);
    const message = `Estoy visualizando la parada ${name} en la aplicación GoBici. http://www.valenbisi.es/`;
    await Share.share({
      message: message,
      title: message,
      url: "http://www.valenbisi.es/"
    });
  }

  renderRouter() {
    const { authenticated } = this.state;
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName={authenticated ? "TabNavigator" : "Login"}
        >
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{
              title: "Bici App"
            }}
          />
          <Stack.Screen
            name="Login"
            options={{
              title: "Login",
              header: () => {}
            }}
            screenOptions={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="Stop"
            test="Test"
            options={{
              title: "Detalle de parada",
              headerRight: () => (
                <Icon
                  active
                  style={{ color: "#ffffff", marginRight: 10 }}
                  onPress={this.onSharePressed}
                  name="share"
                />
              )
            }}
            component={StopScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  renderLoading() {
    return <AppLoading />;
  }

  render() {
    const { isReady } = this.state;
    return isReady ? this.renderRouter() : this.renderLoading();
  }
}
