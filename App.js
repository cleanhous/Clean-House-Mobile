import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/Login"; 
import Home from "./components/Home"; 
import Cadastro from "./components/Cadastro";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
