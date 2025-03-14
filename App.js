import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Faq from "./components/Faq";
import Navbar from "./components/Navbar";
import Eletricista from "./components/Prestadores/Eletricista";
import Diarista from "./components/Prestadores/Diarista";
import Assistencia from "./components/Prestadores/Assistencia";
import Pintor from "./components/Prestadores/Pintor";
import Chaveiro from "./components/Prestadores/Chaveiro";
import Empreiteiro from "./components/Prestadores/Empreiteiro";
import Arquiteto from "./components/Prestadores/Arquiteto";
import Cozinheiro from "./components/Prestadores/Cozinheiro";
import Encanador from "./components/Prestadores/Encanador";

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
        <Stack.Screen
          name="Eletricista"
          component={Eletricista}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Diarista"
          component={Diarista}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Assistencia"
          component={Assistencia}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Pintor"
          component={Pintor}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Chaveiro"
          component={Chaveiro}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Empreiteiro"
          component={Empreiteiro}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Arquiteto"
          component={Arquiteto}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Cozinheiro"
          component={Cozinheiro}
          options={{ headerShown: false}} 
        />
        <Stack.Screen
          name="Encanador"
          component={Encanador}
          options={{ headerShown: false}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}