import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Perfil = () => {
    return (
        <View style={styles.container}>
            <Text>Tela de Perfil</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    }
})

export default Perfil;