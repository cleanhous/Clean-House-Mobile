import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Home from "./Home";
import Pedidos from "./Pedidos"; 
import Perfil from "./Perfil"; 

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#0369A1',
        tabBarInactiveTintColor: 'black', 
        tabBarLabelStyle: {
          fontWeight: 'bold', 
          
        },
      
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign name="home" size={24} color={focused ? '#0369A1' : 'black'} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Pedidos" 
        component={Pedidos} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="file-tray-full-outline" size={24} color={focused ? '#0369A1' : 'black'} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={Perfil} 
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign name="user" size={24} color={focused ? '#0369A1' : 'black'} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Navbar;
