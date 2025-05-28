import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBarHome = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.navTitle}>{title}</Text>
      </View>
      
      <View style={styles.placeholderRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    backgroundColor: '#0284c7',
    paddingTop: Platform.OS === 'ios' ? 40 : 15,
    paddingBottom: 10,
    paddingHorizontal: 25,
    height: Platform.OS === 'ios' ? 90 : 80, 
    paddingTop:30,
    
  },
  backButton: {
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:"center"
  },
  placeholderRight: {
    width: 42, 
  },
});

export default NavBarHome;