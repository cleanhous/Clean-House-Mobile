import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Faq from "./components/Faq";
import Navbar from "./components/Navbar";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Cadastrar"
          component={Cadastro}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Faq"
          component={Faq}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Navbar"
          component={Navbar}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
