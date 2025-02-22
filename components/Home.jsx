import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

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

const Home = () => {

  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.placeholderText}>
          Aqui ficava o header (NavBar, logo etc.)
        </Text>
      </View>

      <View style={styles.servicesPreview}>
        <Text style={styles.servicesTitle}>
          Aqui ficava a prévia de serviços
        </Text>
        <View style={styles.servicesRow}>
          <View style={styles.serviceBox}>
            <Text style={styles.serviceName}>Serviço 1</Text>
            <PlugZap size={32} color="#0284c7" />
          </View>
          <View style={styles.serviceBox}>
            <Text style={styles.serviceName}>Serviço 2</Text>
            <Droplet size={32} color="#0284c7" />
          </View>
          <View style={styles.serviceBox}>
            <Text style={styles.serviceName}>Serviço 3</Text>
            <User size={32} color="#0284c7" />
          </View>
        </View>
      </View>

      <View style={styles.promotionSection}>
        <Handshake size={80} color="#0284c7" />
        <Text style={styles.promoTitle}>Aqui ficava a seção promocional</Text>
        <Text style={styles.promoText}>
          Texto explicando a promoção ou chamada para ação.
        </Text>
      </View>

      <View style={styles.allServicesSection}>
        <Text style={styles.allServicesTitle}>
          Aqui ficava a lista completa de serviços
        </Text>
        <View style={styles.servicesGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>Serviço A</Text>
            <Settings size={24} color="#0284c7" />
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>Serviço B</Text>
            <Paintbrush size={24} color="#0284c7" />
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>Serviço C</Text>
            <KeyRound size={24} color="#0284c7" />
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>Serviço D</Text>
            <LayoutDashboard size={24} color="#0284c7" />
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>Serviço E</Text>
            <BrainCircuit size={24} color="#0284c7" />
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>Serviço F</Text>
            <CookingPot size={24} color="#0284c7" />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.loginText}>Alguma dúvida?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Faq")}>
          <Text style={styles.link}>FAQ</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.placeholderText}>Aqui fica o Footer</Text>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0284c7",
    paddingBottom: 20,
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
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  servicesTitle: {
    textAlign: "center",
    fontSize: 22,
    color: "#0284c7",
    fontWeight: "600",
    marginBottom: 12,
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
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
    color: "#333",
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
  },
  gridItem: {
    backgroundColor: "#e5e7eb",
    width: Dimensions.get("window").width / 3 - 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
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
    fontSize: 16,
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 16,
  }
});
