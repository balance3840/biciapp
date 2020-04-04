import React, { Component } from "react";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/guests/Login";
import { AsyncStorage, Share, Alert, View } from "react-native";
import StopScreen from "./screens/users/Stop";
import { Icon, Container, Content, Spinner } from "native-base";
import { sanitizeString } from "./helpers";
import TabNavigator from "./navigators/TabNavigator";
import * as Font from 'expo-font';
import { navigationRef } from "./navigators/RootNavigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as RootNavigation from './navigators/RootNavigation';
import Loading from "./common/components/Loading";

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
      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
      });
    } catch (error) { }
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


  showLogoutAlert = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Está seguro que desea cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
        { text: 'Si, cerrar sesión', onPress: () => this.onLogout() },
      ],
      { cancelable: false }
    )
  }


  onLogout = async () => {
    await this.setState({ authenticated: false });
    await AsyncStorage.removeItem("username");
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [
        { name: 'Login' },
      ],
    })
    RootNavigation.dispatch(resetAction);
    await RootNavigation.navigate('Login');
  }

  renderRouter() {
    const { authenticated } = this.state;
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName={authenticated ? "TabNavigator" : "Login"}
        >
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{
              title: "Go Bici",
              headerLeft: null,
              headerRight: () => (
                <MaterialCommunityIcons
                  style={{ color: "#ffffff", marginRight: 10, fontSize: 25, marginTop: 5 }}
                  onPress={this.showLogoutAlert}
                  name="logout"
                />
              )
            }}
          />
          <Stack.Screen
            name="Login"
            options={{
              title: "Login",
              header: () => { }
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
    return (
      <Loading />
    )
  }

  render() {
    const { isReady } = this.state;
    return isReady ? this.renderRouter() : this.renderLoading();
  }
}
