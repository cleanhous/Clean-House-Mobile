import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const faqData = [
  {
    question: "Os profissionais são confiáveis?",
    answer:
      "Todos os profissionais são previamente verificados, possuindo certificações e avaliações de outros clientes, garantindo segurança e qualidade.",
    icon: "award",
  },
  {
    question: "Como posso acompanhar o status do meu serviço?",
    answer:
      "Após contratar um serviço, você pode acompanhar o status em tempo real pelo aplicativo. O profissional enviará atualizações e notificações conforme necessário.",
    icon: "message-circle",
  },
  {
    question: "Posso escolher o profissional que fará o serviço?",
    answer:
      "Sim, você pode visualizar os perfis dos profissionais disponíveis, incluindo suas avaliações e especialidades, para escolher o que mais se adequa às suas necessidades.",
    icon: "users",
  },
  {
    question: "Como posso entrar em contato com vocês?",
    answer:
      "Você pode entrar em contato conosco através do nosso aplicativo ou pelo número de telefone disponível na página de contato.",
    icon: "phone",
  },
];

const FAQItem = ({ item, isExpanded, onToggle }) => {
  const animation = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  const opacity = animation;

  return (
    <View style={styles.faqBox}>
      <TouchableOpacity onPress={onToggle} style={styles.faqHeader}>
        <Icon name={item.icon} size={24} color="#0369a1" style={styles.icon} />
        <Text style={styles.question}>{item.question}</Text>
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#0369a1"
        />
      </TouchableOpacity>

      <Animated.View style={[styles.animatedContainer, { height, opacity }]}>
        <Text style={styles.answer}>{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Perguntas Frequentes (FAQ)</Text>

        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            item={item}
            isExpanded={expandedIndex === index}
            onToggle={() => toggleExpand(index)}
          />
        ))}

      </ScrollView>
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginInline: 15,
    marginLeft:0,
    marginRight: 0

  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
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
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0369a1",
    flex: 1,
    marginLeft: 10,
  },
  animatedContainer: {
    overflow: "hidden",
    marginTop: 10,
  },
  answer: {
    fontSize: 14,
    color: "#4b5563",
  },
  textContact: {
    color: "#0369A1",
    fontWeight: "bold",
    fontSize: 16,
  },
  contactView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonContact: {
    width: "50%",
    backgroundColor: "#0369A1",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
