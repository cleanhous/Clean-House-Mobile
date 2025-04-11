import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Perfil = () => {
    const [originalData] = useState({
        email: 'usuario@email.com',
        senha: '',
        telefone: '',
        cepInput: '',
        uf: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: ''
    });

    const [email, setEmail] = useState(originalData.email);
    const [senha, setSenha] = useState(originalData.senha);
    const [telefone, setTelefone] = useState(originalData.telefone);
    const [cepInput, setCepInput] = useState(originalData.cepInput);
    const [uf, setUf] = useState(originalData.uf);
    const [cidade, setCidade] = useState(originalData.cidade);
    const [bairro, setBairro] = useState(originalData.bairro);
    const [logradouro, setLogradouro] = useState(originalData.logradouro);
    const [numero, setNumero] = useState(originalData.numero);
    const [complemento, setComplemento] = useState(originalData.complemento);
    const [isEditing, setIsEditing] = useState(false);
    
    const handleSave = () => {
        console.log('Dados salvos:', { email, senha, telefone, cepInput, uf, cidade, bairro, logradouro, numero, complemento });
        setIsEditing(false);
    };
    
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };
    
    const handleCancel = () => {
        setEmail(originalData.email);
        setSenha(originalData.senha);
        setTelefone(originalData.telefone);
        setCepInput(originalData.cepInput);
        setUf(originalData.uf);
        setCidade(originalData.cidade);
        setBairro(originalData.bairro);
        setLogradouro(originalData.logradouro);
        setNumero(originalData.numero);
        setComplemento(originalData.complemento);
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minha Conta</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="CEP"
                keyboardType="numeric"
                value={cepInput}
                onChangeText={setCepInput}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="UF"
                value={uf}
                onChangeText={setUf}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Cidade"
                value={cidade}
                onChangeText={setCidade}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Bairro"
                value={bairro}
                onChangeText={setBairro}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Logradouro"
                value={logradouro}
                onChangeText={setLogradouro}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Número"
                keyboardType="numeric"
                value={numero}
                onChangeText={setNumero}
                editable={isEditing}
            />
            <TextInput
                style={styles.input}
                placeholder="Complemento"
                value={complemento}
                onChangeText={setComplemento}
                editable={isEditing}
            />
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
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 60,
        textAlign: 'center',
        color: "#0369A1",
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

export default Perfil;