import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        © {currentYear} Clean House. Todos os direitos reservados.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#0284c7', 
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#0284c7'
  },
  footerText: {
    fontSize: 20,
    color: '#e5e7eb', 
    textAlign: 'center',
  },
});

export default Footer;