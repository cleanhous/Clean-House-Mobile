import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
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
import Footer from "./Footer";

const Home = () => {
  const navigation = useNavigation();
  const handleClick = () => {
    navigation.navigate("Login");
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.servicesPreview}>
        <Image source={require("../assets/logo1.png")} style={styles.imagem} />
        <Text style={styles.serviceSubtitle}>
          Praticidade, comodidade e segurança em um só aplicativo
        </Text>
      </View>

      <View style={styles.promotionSection}>
        <Handshake size={80} color="#0284c7" />
        <Text style={styles.promoTitle}>Precisando de praticidade?</Text>
        <Text style={styles.promoText}>
          Estamos aqui para ajudar você a encontrar os melhores profissionais
          com facilidade e confiança. Conte com a gente!
        </Text>
      </View>

      <View style={styles.allServicesSection}>
        <Text style={styles.allServicesTitle}>Todos os nossos serviços</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("Assistencia")}
          >
            <Text style={styles.gridItemText}>Assistência técnica</Text>
            <Settings size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Pintor")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Pintor</Text>
            <Paintbrush size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chaveiro")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Chaveiro</Text>
            <KeyRound size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Empreiteiro")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Empreiteiro</Text>
            <LayoutDashboard size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Arquiteto")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Arquiteto</Text>
            <BrainCircuit size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cozinheiro")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Cozinheiro</Text>
            <CookingPot size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Diarista")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Diarista</Text>
            <User size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Eletricista")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Eletricista</Text>
            <PlugZap size={20} color="#0284c7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Encanador")}
            style={styles.gridItem}
          >
            <Text style={styles.gridItemText}>Encanador</Text>
            <Droplet size={20} color="#0284c7" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.loginText}>Alguma dúvida?</Text>
        <FAQ />
      </View>
      <Footer />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0284c7",
    paddingBottom: 20,
    minHeight: "100%",
  },
  imagem: {
    width: 200,
    height: 200,
    alignSelf: "center",
    resizeMode: "contain",
  },
  placeholderText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 8,
  },
  headerSection: {
    marginVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  servicesPreview: {
    marginVertical: 30,
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  serviceSubtitle: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
    fontWeight: "600",
    marginBottom: 12,
    color: "#136391",
  },
  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  serviceBox: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    width: 100,
  },
  serviceName: {
    color: "#0284c7",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  promotionSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0284c7",
    marginTop: 12,
    textAlign: "center",
  },
  promoText: {
    textAlign: "center",
    marginVertical: 12,
    fontSize: 20,
    marginBottom: 12,
    color: "#136391",
    fontWeight: "400",
  },
  allServicesSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  allServicesTitle: {
    textAlign: "center",
    fontSize: 22,
    color: "#0284c7",
    fontWeight: "600",
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  gridItem: {
    backgroundColor: "#e5e7eb",
    width: "30%",
    height: 100,
    padding: 12,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    padding: 10,
  },
  gridItemText: {
    color: "#0284c7",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 16,
  },
});
