import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export const CadastroScreen = ({ navigation }) => {  // Apenas pegando navigation da propriedade
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    uf: "",
    cep: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    cidade: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);
    navigation.navigate("Login");  // Agora funciona corretamente
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={formData.nome}
        onChangeText={(text) => handleInputChange("nome", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={formData.cpf}
        onChangeText={(text) => handleInputChange("cpf", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={formData.telefone}
        onChangeText={(text) => handleInputChange("telefone", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={formData.senha}
        onChangeText={(text) => handleInputChange("senha", text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="UF"
        value={formData.uf}
        onChangeText={(text) => handleInputChange("uf", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={formData.cep}
        onChangeText={(text) => handleInputChange("cep", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bairro"
        value={formData.bairro}
        onChangeText={(text) => handleInputChange("bairro", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Logradouro"
        value={formData.logradouro}
        onChangeText={(text) => handleInputChange("logradouro", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={formData.numero}
        onChangeText={(text) => handleInputChange("numero", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Complemento"
        value={formData.complemento}
        onChangeText={(text) => handleInputChange("complemento", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={formData.cidade}
        onChangeText={(text) => handleInputChange("cidade", text)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit} // Chama handleSubmit, que agora redireciona corretamente
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0077b6",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0077b6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CadastroScreen;
