import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StopsScreen from "../screens/users/Stops";
import HomeScreen from "../screens/users/Home";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import NearestStops from "../screens/users/NearestStops";
import ConfigurationScreen from "../screens/users/Configuration";

const Tab = createBottomTabNavigator();

class TabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Tab.Navigator initialRouteName={"Home"}>
        <Tab.Screen
          name="Stops"
          options={{
            tabBarLabel: "Paradas",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bike" color={color} size={size} />
            )
          }}
          component={StopsScreen}
        />
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: "Mapa",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" color={color} size={size} />
            )
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="NearestStops"
          options={{
            tabBarLabel: "Cercanas",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="place" color={color} size={size} />
            )
          }}
          component={NearestStops}
        />
        <Tab.Screen
          name="Configuration"
          options={{
            tabBarLabel: "Configuración",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="wrench" color={color} size={size} />
            )
          }}
          component={ConfigurationScreen}
        />
      </Tab.Navigator>
    );
  }
}

export default TabNavigator;
