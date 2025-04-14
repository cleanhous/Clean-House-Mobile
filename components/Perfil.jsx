import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const MinhaConta = () => {
    const [originalData, setOriginalData] = useState(null);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cepInput, setCepInput] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('acessToken');
            if (!token) {
                Alert.alert('Erro', 'Usuário não autenticado');
                return;
            }
            try {
                const response = await api.get('/clientes', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = response.data;
                setOriginalData(userData);
                setEmail(userData.email);
                setTelefone(userData.telefone);
                setCepInput(userData.cep);
                setCidade(userData.cidade);
                setBairro(userData.bairro);
                setLogradouro(userData.logradouro);
                setNumero(userData.numero);
                setComplemento(userData.complemento);
            } catch (error) {
                Alert.alert('Erro', 'Falha ao carregar os dados do usuário');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('acessToken');
        if (!token) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }
        try {
            const dataToUpdate = {
                email, 
                telefone, 
                cep: cepInput, 
                cidade, 
                bairro, 
                logradouro, 
                numero, 
                complemento
            };

            if (senha) {
                dataToUpdate.senha = senha;
            }

            await api.put('/clientes', dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
            setIsEditing(false);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao atualizar os dados');
        }
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        if (originalData) {
            setEmail(originalData.email);
            setTelefone(originalData.telefone);
            setCepInput(originalData.cep);
            setCidade(originalData.cidade);
            setBairro(originalData.bairro);
            setLogradouro(originalData.logradouro);
            setNumero(originalData.numero);
            setComplemento(originalData.complemento);
        }
        setSenha('');
        setIsEditing(false);
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0369A1" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minha Conta</Text>
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} editable={isEditing} />
            <TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={cepInput} onChangeText={setCepInput} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Logradouro" value={logradouro} onChangeText={setLogradouro} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Número" keyboardType="numeric" value={numero} onChangeText={setNumero} editable={isEditing} />
            <TextInput style={styles.input} placeholder="Complemento" value={complemento} onChangeText={setComplemento} editable={isEditing} />
            <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : handleEdit}>
                <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
            </TouchableOpacity>
            {isEditing && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0369A1',
        marginBottom: 20,
        marginTop: 60,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#0369A1',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: '#0369A1',
    },
    button: {
        width: '100%',
        backgroundColor: '#0369A1',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0369A1',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        width: '100%',
        backgroundColor: '#d9534f',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#d9534f',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default MinhaConta;
