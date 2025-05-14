import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import {
  PlugZap,
  Droplet,
  User,
  Handshake,
  Settings,
  Paintbrush,
  KeyRound,
  LayoutDashboard,
  BrainCircuit,
  CookingPot,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import FAQ from "./Faq";

const services = [
  { name: "Assistência técnica", icon: Settings, screen: "Assistencia" },
  { name: "Pintor", icon: Paintbrush, screen: "Pintor" },
  { name: "Chaveiro", icon: KeyRound, screen: "Chaveiro" },
  { name: "Empreiteiro", icon: LayoutDashboard, screen: "Empreiteiro" },
  { name: "Arquiteto", icon: BrainCircuit, screen: "Arquiteto" },
  { name: "Cozinheiro", icon: CookingPot, screen: "Cozinheiro" },
  { name: "Diarista", icon: User, screen: "Diarista" },
  { name: "Eletricista", icon: PlugZap, screen: "Eletricista" },
  { name: "Encanador", icon: Droplet, screen: "Encanador" },
];

const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a618d" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/logo1.png")}
            style={styles.logo}
          />
          <Text style={styles.tagline}>
            Praticidade, comodidade e segurança em um só aplicativo
          </Text>
        </View>

        <View style={[styles.promoCard, styles.fullWidth]}>
          <Handshake size={70} color="#0284c7" />
          <Text style={styles.promoTitle}>Precisando de praticidade?</Text>
          <Text style={styles.promoText}>
            Estamos aqui para ajudar você a encontrar os melhores profissionais
            com facilidade e confiança.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todos os nossos serviços</Text>
          <View style={styles.grid}>
            {services.map(({ name, icon: Icon, screen }) => (
              <TouchableOpacity
                key={name}
                style={styles.card}
                onPress={() => navigation.navigate(screen)}
              >
                <Icon size={32} color="#0284c7" />
                <Text style={styles.cardText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.fullWidth]}>
          <FAQ />
        </View>

        <Text style={styles.footer}>© 2025 Clean House - Todos os direitos reservados</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: "#0a618d",

  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    marginTop: 15,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginLeft: 18,
    marginRight: 18,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#0a618d",
    marginTop: 12,
    
  },
  promoCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginLeft: 18,
    marginRight: 18,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a618d",
    marginTop: 12,
    textAlign: "center",
  },
  promoText: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginTop: 10,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginInline: 16,
    borderRadius: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a618d",
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "31%", // Ajustado para 3 colunas
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 20, // Padding superior e inferior mantidos
    paddingHorizontal: 12, 
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0a618d",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 14,
    color: "#b0bed2",
    marginTop: 40,
  },
});