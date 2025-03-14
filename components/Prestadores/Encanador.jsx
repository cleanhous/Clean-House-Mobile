import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const Encanador = () => {
  const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text>Tela de Encanador</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Navbar') }>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    }
});

export default Encanador;