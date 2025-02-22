import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const FAQ = () => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Perguntas Frequentes (FAQ)</Text>

        <View style={styles.faqBox}>
          <View style={styles.faqHeader}>
            <Icon
              name="message-circle"
              size={24}
              color="#0369a1"
              style={styles.icon}
            />
            <Text style={styles.question}>
              Como posso acompanhar o status do meu serviço?
            </Text>
          </View>
          <Text style={styles.answer}>
            Após contratar um serviço, você pode acompanhar o status em tempo
            real pelo aplicativo. O profissional enviará atualizações e
            notificações conforme necessário.
          </Text>
        </View>

        <View style={styles.faqBox}>
          <View style={styles.faqHeader}>
            <Icon name="phone" size={24} color="#0369a1" style={styles.icon} />
            <Text style={styles.question}>
              Como posso entrar em contato com vocês?
            </Text>
          </View>
          <Text style={styles.answer}>
            Você pode entrar em contato conosco através do nosso aplicativo ou
            pelo número de telefone disponível na página de contato.
          </Text>
        </View>

        <View style={styles.faqBox}>
          <View style={styles.faqHeader}>
            <Icon name="users" size={24} color="#0369a1" style={styles.icon} />
            <Text style={styles.question}>
              Posso escolher o profissional que fará o serviço?
            </Text>
          </View>
          <Text style={styles.answer}>
            Sim, você pode visualizar os perfis dos profissionais disponíveis,
            incluindo suas avaliações e especialidades, para escolher o que mais
            se adequa às suas necessidades.
          </Text>
        </View>

        <View style={styles.faqBox}>
          <View style={styles.faqHeader}>
            <Icon name="award" size={24} color="#0369a1" style={styles.icon} />
            <Text style={styles.question}>
              Os profissionais são confiáveis?
            </Text>
          </View>
          <Text style={styles.answer}>
            Todos os profissionais são previamente verificados, possuindo
            certificações e avaliações de outros clientes, garantindo segurança
            e qualidade.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0369a1",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 20,
    marginTop: 10,
  },
  faqBox: {
    backgroundColor: "#e5e7eb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0369a1",
    flex: 1,
  },
  answer: {
    fontSize: 14,
    color: "#4b5563",
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
});
