import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NavBarHome from "./NavBarHome.jsx"; 
import api from "../services/api.js"; 

const Pedidos = () => {
  const navigation = useNavigation();
  const [contratos, setContratos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [estrelas, setEstrelas] = useState(0);

  const fetchContratos = async () => {
    try {
      const response = await api.get("/contratos/cliente", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContratos(response.data);
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
    }
  };

 

  useEffect(() => {
    fetchContratos();
  }, []);

  return (
    <View style={styles.container}>
      <NavBarHome />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Histórico de serviços</Text>
        {contratos.length > 0 ? (
          contratos.map((contrato, index) => (
            <View key={index} style={styles.contratoContainer}>
              <Text style={styles.contratoNome}>{contrato.nome}</Text>
              <Text>
                Início: {new Date(contrato.data_inicio).toLocaleString()}
              </Text>
              <Text>Fim: {new Date(contrato.data_fim).toLocaleString()}</Text>
              <Text>Observações: {contrato.observacao}</Text>
              {contrato.status_id === 3 ? (
                <Text style={styles.statusCancelado}>Cancelado</Text>
              ) : contrato.avaliado ? (
                <View style={styles.avaliadoContainer}>
                  <Text style={styles.statusAvaliado}>Avaliado</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text
                        key={star}
                        style={
                          star <= contrato.nota
                            ? styles.starFilled
                            : styles.starEmpty
                        }
                      >
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  {new Date(contrato.data_fim) < new Date() && (
                    <TouchableOpacity
                      onPress={() => handleAvaliarClick(contrato)}
                      style={styles.avaliarButton}
                    >
                      <Text style={styles.buttonText}>Avaliar Serviço</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => cancelarPedido(contrato.id)}
                    style={styles.cancelarButton}
                  >
                    <Text style={styles.buttonText}>Cancelar Pedido</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noContratos}>Nenhum contrato encontrado.</Text>
        )}
      </ScrollView>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Avalie o serviço</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setEstrelas(star)}>
                  <Text
                    style={
                      star <= estrelas ? styles.starFilled : styles.starEmpty
                    }
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={enviarAvaliacao}
              style={styles.enviarButton}
            >
              <Text style={styles.buttonText}>Enviar Avaliação</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.cancelarModalButton}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0ea5e9", 
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  contratoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  contratoNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0369a1", 
  },
  statusCancelado: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dc2626", 
  },
  avaliadoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusAvaliado: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7280", 
  },
  starsContainer: {
    flexDirection: "row",
  },
  starFilled: {
    fontSize: 24,
    color: "#eab308", 
  },
  starEmpty: {
    fontSize: 24,
    color: "#d1d5db", 
  },
  avaliarButton: {
    backgroundColor: "#0284c7", 
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelarButton: {
    backgroundColor: "#dc2626", 
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  noContratos: {
    textAlign: "center",
    color: "#6b7280", 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0369a1", 
    marginBottom: 16,
  },
  enviarButton: {
    backgroundColor: "#0284c7", 
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  cancelarModalButton: {
    backgroundColor: "#d1d5db", 
    borderRadius: 8,
    marginTop: 8,
  },
});

export default Pedidos;
