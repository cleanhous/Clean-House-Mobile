import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CEP from "../services/cep.js"

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("")
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate("Login")
  }

  const handleSubmit = () => {
    setIsLoading(true);
    setErrorMessage("");
  
    // Simulação de cadastro (setTimeout)
    setTimeout(() => {
      if (nome && email && senha && cpf && telefone && cep && numero) {
        // Simula o sucesso no cadastro e navega para a tela de Login
        alert("Cadastro realizado com sucesso!");
        navigation.navigate("Login");
      } else {
        // Exibe mensagem de erro caso falte algum campo obrigatório
        setErrorMessage("Preencha todos os campos obrigatórios!");
      }
      setIsLoading(false);
    }, 1500);
  };
  

  const buscarCep = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, "");
    if (cepValue.length !== 8) {
      alert("Insira um Cep valido");
      return;
    }

    try {
      const response = await CEP.get(`/${cepValue}/json/`);
      setBairro(response.data.bairro)
      setLogradouro(response.data.logradouro);
      setCep(cepValue);
      setUf(response.data.uf);
      setCidade(response.data.localidade);
    } catch (error) {
      console.log(error);
    }
  };
    
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Faça seu Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          keyboardType='default'
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

<       TextInput
          style={styles.input}
          placeholder="Telefone"
          keyboardType='numeric'
          value={telefone}
          onChangeText={setTelefone}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          keyboardType='numeric'
          value={cpf}
          onChangeText={setCpf}
        />

        <TextInput
          style={styles.input}
          placeholder="Cep"
          keyboardType='numeric'
          onBlur={buscarCep}
        />

        <TextInput
          style={styles.input}
          placeholder="UF"
          keyboardType='default'
          value={uf}
          readOnly
        />

        <TextInput
          style={styles.input}
          placeholder="Cidade"
          keyboardType='default'
          value={cidade}
          readOnly
        />

        <TextInput
          style={styles.input}
          placeholder="Bairro"
          keyboardType='default'
          value={bairro}
          readOnly
        />

        <TextInput
          style={styles.input}
          placeholder="Logradouro"
          keyboardType='default'
          value={logradouro}
          readOnly
        />

        <TextInput
          style={styles.input}
          placeholder="Número"
          keyboardType='numeric'
          value={numero}
          onChangeText={setNumero}
        />

        <TextInput
          style={styles.input}
          placeholder="Complemento"
          keyboardType='default'
          value={complemento}
          onChangeText={setComplemento}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastro</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigate}
        >
            <Text style={styles.link}>Já tem uma conta? Faça seu Login</Text>
        </TouchableOpacity>


    </View>
  )
}

export default Cadastro

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#38BDF8"
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 20,
    },
    input: {
      width: "80%",
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 10,
    },
    button: {
      width: "100%",
      backgroundColor: "#0369A1",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    error: {
      color: "red",
      marginBottom: 10,
    },
    link: {
      color: "#fff",
      marginTop: 10,
      textDecorationLine: "underline",
    }
});