import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import cep from "../services/cep";
import api from "../services/api";
import Logo from "../assets/logo.svg"

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [uf, setUf] = useState("");
  const [cepInput, setCepInput] = useState("");
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [termoAceito, setTermoAceito] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const navigation = useNavigation();

  const formatarCpf = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const handleCpfChange = (text) => {
    const cpfFormatado = formatarCpf(text);
    setCpf(cpfFormatado);
  };

  const buscarCep = async () => {
    const cepValue = cepInput.replace(/\D/g, "");
    if (cepValue.length !== 8) {
      Alert.alert("Erro", "Insira um CEP válido com 8 dígitos");
      return;
    }

    try {
      const response = await cep.get(`${cepValue}/json/`);
      const data = response.data;

      if (data.erro) {
        Alert.alert("Erro", "CEP não encontrado");
        return;
      }

      setBairro(data.bairro);
      setLogradouro(data.logradouro);
      setUf(data.uf);
      setCidade(data.localidade);
    } catch (error) {
      console.log("Erro ao buscar CEP:", error);
      Alert.alert("Erro", "Não foi possível buscar o CEP");
    }
  };

  const handleRegister = async () => {
    if (!termoAceito) {
      Alert.alert(
        "Erro",
        "Você precisa aceitar os termos de política e privacidade"
      );
      return;
    }

    try {
      const response = await api.post("/cadastro", {
        nome,
        email,
        cpf,
        telefone,
        senha,
        uf,
        cidade,
        bairro,
        logradouro,
        cep: cepInput,
        numero,
        complemento,
      });

      console.log("Cadastro realizado com sucesso:", response.data);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate("Login");
      }, 2000);

      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setSenha("");
      setComplemento("");
      setUf("");
      setCepInput("");
      setBairro("");
      setLogradouro("");
      setCidade("");
      setNumero("");
      setTermoAceito(false);
    } catch (error) {
      console.log("Erro ao realizar cadastro:", error);
      let errors = ["Erro desconhecido"];
      if (error.response) {
        console.log("Resposta do servidor:", error.response.data);
        errors = error.response.data.errors || [
            error.response.data.message,
          ] || ["Erro no servidor"];
      } else if (error.request) {
        console.log("Erro de requisição:", error.request);
        errors = ["Erro de rede ou servidor indisponível"];
      }
      setErrorMessages(errors);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Logo width={100} height={100} style={styles.logo} />
        <Text style={styles.title}>Faça seu Cadastro</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            onChangeText={setNome}
            value={nome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />

          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            onChangeText={handleCpfChange}
            value={cpf}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="85999999999"
            keyboardType="phone-pad"
            onChangeText={setTelefone}
            value={telefone}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            secureTextEntry
            onChangeText={setSenha}
            value={senha}
          />

          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            placeholder="00000000"
            keyboardType="numeric"
            onChangeText={setCepInput}
            onEndEditing={buscarCep}
            value={cepInput}
          />

          <Text style={styles.label}>UF</Text>
          <TextInput
            style={styles.input}
            placeholder="UF"
            value={uf}
            editable={false}
          />

          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={cidade}
            editable={false}
          />

          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={bairro}
            editable={false}
          />

          <Text style={styles.label}>Rua</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua"
            value={logradouro}
            editable={false}
          />

          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            placeholder="000"
            keyboardType="numeric"
            onChangeText={setNumero}
            value={numero}
          />

          <Text style={styles.label}>Complemento</Text>
          <TextInput
            style={styles.input}
            placeholder="Complemento"
            onChangeText={setComplemento}
            value={complemento}
          />

          <View style={styles.checkboxContainer}>
            <Switch value={termoAceito} onValueChange={setTermoAceito} />
            <Text style={styles.checkboxLabel}>
              Sim, eu aceito os{" "}
              <Text style={styles.link} onPress={() => setShowTermsModal(true)}>
                termos de política e privacidade
              </Text>
            </Text>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Faça seu login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={!termoAceito}
            style={[
              styles.button,
              { backgroundColor: termoAceito ? "#0369A1" : "#A0AEC0" },
            ]}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={errorMessages.length > 0} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitleError}>Erros no Cadastro</Text>
            {errorMessages.map((msg, index) => (
              <Text key={index} style={styles.modalText}>
                • {msg}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorMessages([])}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Cadastro realizado com sucesso!
            </Text>
            <Text style={styles.modalText}>
              Você será redirecionado para a página de login em breve.
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showTermsModal} transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Termos de Política e Privacidade
            </Text>
            <Text style={styles.modalText}>
              Bem-vindo à nossa plataforma. Estes Termos de Política e
              Privacidade descrevem como coletamos, usamos e protegemos as
              informações fornecidas pelos usuários.
              {"\n\n"}
              **1. Coleta de Informações:** Coletamos informações como nome,
              e-mail, CPF, telefone, endereço, entre outros, para proporcionar
              uma experiência completa na plataforma.
              {"\n\n"}
              **2. Uso das Informações:** As informações são usadas para
              processar cadastros, melhorar a experiência do usuário e comunicar
              atualizações importantes.
              {"\n\n"}
              **3. Compartilhamento de Informações:** Não compartilhamos dados
              com terceiros, salvo em casos de exigência legal.
              {"\n\n"}
              **4. Segurança dos Dados:** Tomamos medidas para proteger as
              informações dos usuários, mas não garantimos 100% de segurança.
              {"\n\n"}
              **5. Direitos dos Usuários:** Os usuários podem acessar, corrigir
              ou solicitar a exclusão de suas informações.
              {"\n\n"}
              **6. Cookies:** Utilizamos cookies para analisar o desempenho e
              melhorar a experiência de navegação.
              {"\n\n"}
              **7. Alterações na Política de Privacidade:** Podemos atualizar
              esta política conforme necessário, notificando os usuários sobre
              mudanças significativas.
              {"\n\n"}
              **8. Contato:** Em caso de dúvidas, entre em contato conosco.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    marginTop: 70,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0369A1",
    marginBottom: 20,
    marginTop: 10
  },
  formContainer: {
    width: "95%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    color: "#0369A1",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0369A1",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    color: "#0369A1",
    marginTop: 10,
    marginLeft: 10,
    flexWrap: "wrap",  
    width: "80%",  
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "#0369A1",
  },
  link: {
    color: "#0369A1",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0369A1",
    marginBottom: 10,
  },
  modalTitleError: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#0369A1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Cadastro;
