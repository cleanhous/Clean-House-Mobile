import {View, Text,StyleSheet} from 'react-native';
import React from 'react';

const Pedidos = () => {
    return (
        <View style={styles.container}>
            <Text>Tela de Pedidos</Text>
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

export default Pedidos;