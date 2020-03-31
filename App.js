import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/guests/Login";
import HomeScreen from "./screens/users/Home";
import { AsyncStorage } from 'react-native';
import { AppLoading } from "expo";

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

  async componentWillMount() {
    try {
      const value = await AsyncStorage.getItem("username");
      if(value) {
        this.setState({ authenticated: true });
      }
    } catch (error) {
      ;
    }
    this.setState({ isReady: true })
  }

  renderRouter() {
    const { authenticated } = this.state;
    return (
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={authenticated ? "Home" : "Login"}
      >
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
          name="Home"
          options={
            { 
              title: "Bici app",
              headerLeft: null 
            }
          }
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }

  renderLoading() {
    return (
      <AppLoading />
    )
  }

  render() {
    const { isReady } = this.state;
    return (
      isReady ? this.renderRouter() : this.renderLoading()
    )
  }
}
