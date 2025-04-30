import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../../services/api";
import NavBarHome from "../NavBarHome";


const Filtro = ({
  filtroNota,
  setFiltroNota,
  precoDe,
  setPrecoDe,
  precoAte,
  setPrecoAte,
  dataInicial,
  setDataInicial,
  dataFinal,
  setDataFinal,
  onFiltrar,
}) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  return (
    <View style={styles.filterContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nota (0-5)"
        value={filtroNota}
        onChangeText={setFiltroNota}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço Mínimo"
        value={precoDe}
        onChangeText={setPrecoDe}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço Máximo"
        value={precoAte}
        onChangeText={setPrecoAte}
        keyboardType="numeric"
      />
      <TouchableOpacity
        onPress={() => setShowStartDate(true)}
        style={styles.dateButton}
      >
        <Text>
          {dataInicial
            ? dataInicial.toLocaleDateString("pt-BR")
            : "Data Inicial"}
        </Text>
      </TouchableOpacity>
      {showStartDate && (
        <DateTimePicker
          value={dataInicial || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDate(Platform.OS === "ios");
            if (date) setDataInicial(date);
          }}
        />
      )}
      <TouchableOpacity
        onPress={() => setShowEndDate(true)}
        style={styles.dateButton}
      >
        <Text>
          {dataFinal ? dataFinal.toLocaleDateString("pt-BR") : "Data Final"}
        </Text>
      </TouchableOpacity>
      {showEndDate && (
        <DateTimePicker
          value={dataFinal || new Date()}
          mode="date"
          display="default"
          minimumDate={dataInicial}
          onChange={(event, date) => {
            setShowEndDate(Platform.OS === "ios");
            if (date) setDataFinal(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.filterButton} onPress={onFiltrar}>
        <Text style={styles.buttonText}>Filtrar Assistências Técnicas</Text>
      </TouchableOpacity>
    </View>
  );
};

const AssistenciaTecnica = () => {
  const [filtroNota, setFiltroNota] = useState("");
  const [precoDe, setPrecoDe] = useState("");
  const [precoAte, setPrecoAte] = useState("");
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [assistenciasTecnicas, setAssistenciasTecnicas] = useState([]);
  const [filteredAssistenciasTecnicas, setFilteredAssistenciasTecnicas] =
    useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedAssistenciaTecnica, setSelectedAssistenciaTecnica] =
    useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [prestadorSchedule, setPrestadorSchedule] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation();

  const fetchAssistenciasTecnicas = async () => {
    try {
      const response = await api.get("/assistenciatecnica");
      setAssistenciasTecnicas(response.data);
      setFilteredAssistenciasTecnicas(response.data);
    } catch (error) {
      console.error("Erro ao buscar assistências técnicas:", error);
    }
  };

  useEffect(() => {
    fetchAssistenciasTecnicas();
  }, []);

  useEffect(() => {
    if (selectedAssistenciaTecnica) {
      api
        .get(`/prestadores/${selectedAssistenciaTecnica.id}/schedule`)
        .then((response) => {
          setPrestadorSchedule(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar agenda da assistência técnica:", error);
        });
    }
  }, [selectedAssistenciaTecnica]);

  const isDateOccupied = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return prestadorSchedule.some((item) => {
      const start = new Date(item.data_inicio);
      const end = new Date(item.data_fim);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return targetDate >= start && targetDate <= end;
    });
  };

  const handleFiltrar = async () => {
    try {
      let response;
      if (dataInicial && dataFinal) {
        response = await api.get(
          "/prestadores-disponiveis/assistenciatecnica",
          {
            params: {
              dataInicio: dataInicial.toISOString().split("T")[0],
              dataFim: dataFinal.toISOString().split("T")[0],
            },
          }
        );
      } else {
        response = await api.get("/assistenciatecnica");
      }

      const data = response.data;

      const filtered = data.filter((assistenciaTecnica) => {
        let matches = true;
        if (filtroNota)
          matches =
            matches &&
            parseInt(assistenciaTecnica.nota) === parseInt(filtroNota);
        if (precoDe)
          matches = matches && assistenciaTecnica.preco >= parseFloat(precoDe);
        if (precoAte)
          matches = matches && assistenciaTecnica.preco <= parseFloat(precoAte);
        return matches;
      });

      setFilteredAssistenciasTecnicas(filtered);
    } catch (error) {
      console.error("Erro ao buscar assistências técnicas:", error);
    }
  };

  const handleCheckAvailability = (assistenciaTecnica) => {
    setSelectedAssistenciaTecnica(assistenciaTecnica);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAssistenciaTecnica(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setObservacoes("");
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleConfirmation = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      console.error("Datas de início e fim são obrigatórias.");
      return;
    }
    if (selectedEndDate <= selectedStartDate) {
      console.error("A data final deve ser posterior à data inicial.");
      return;
    }

    try {
      const dataInicioFormatted = selectedStartDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const dataFimFormatted = selectedEndDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const token = await AsyncStorage.getItem("acessToken");

      const response = await api.post(
        "/contrato",
        {
          prestadorId: selectedAssistenciaTecnica.id,
          dataInicio: dataInicioFormatted,
          dataFim: dataFimFormatted,
          observacao: observacoes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Contratação confirmada com sucesso", response.data);
      setShowPopup(false);
      setShowConfirmationPopup(true);
    } catch (error) {
      console.error(
        "Erro ao confirmar contratação:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRedirect = () => {
    setShowConfirmationPopup(false);
    navigation.navigate("Pedidos");
  };

  const formatarPreco = (preco) => {
    return `R$ ${parseFloat(preco).toFixed(2)} por diária`;
  };

  return (
    <ScrollView style={styles.container}>
      <NavBarHome title={"Assitência Técnica"} />
      <View style={styles.content}>
        <Text style={styles.title}>Serviços de Assistência Técnica</Text>
        <Text style={styles.subtitle}>
          Encontre assistências técnicas qualificadas para suas necessidades,
          garantindo segurança e qualidade no serviço.
        </Text>

        <Filtro
          filtroNota={filtroNota}
          setFiltroNota={setFiltroNota}
          precoDe={precoDe}
          setPrecoDe={setPrecoDe}
          precoAte={precoAte}
          setPrecoAte={setPrecoAte}
          dataInicial={dataInicial}
          setDataInicial={setDataInicial}
          dataFinal={dataFinal}
          setDataFinal={setDataFinal}
          onFiltrar={handleFiltrar}
        />

        <Text style={styles.sectionTitle}>Nossas Assistências Técnicas</Text>

        {filteredAssistenciasTecnicas.length > 0 ? (
          filteredAssistenciasTecnicas.map((assistenciaTecnica) => (
            <View key={assistenciaTecnica.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{assistenciaTecnica.nome}</Text>
              </View>
              <Text style={styles.cardText}>{assistenciaTecnica.titulo}</Text>
              <Text style={styles.cardText}>
                {assistenciaTecnica.descricao}
              </Text>
              <Text style={styles.cardPrice}>
                {formatarPreco(assistenciaTecnica.preco)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/55${assistenciaTecnica.telefone.replace(
                      /[^\d]/g,
                      ""
                    )}`
                  )
                }
                style={styles.whatsappButton}
              >
                <Text style={styles.whatsappText}>Contato via WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.hireButton}
                onPress={() => handleCheckAvailability(assistenciaTecnica)}
              >
                <Text style={styles.buttonText}>
                  Contratar {assistenciaTecnica.nome}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            Nenhuma assistência técnica disponível com os filtros selecionados.
          </Text>
        )}
      </View>
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Disponibilidade de {selectedAssistenciaTecnica?.nome}
            </Text>
            <Text>Selecione a data e o horário desejado:</Text>

            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              <Text>
                {selectedStartDate
                  ? selectedStartDate.toLocaleString("pt-BR", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "Data e Hora Inicial"}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={selectedStartDate || new Date()}
                mode="datetime"
                display="default"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  const currentDate = date || selectedStartDate;
                  setShowStartPicker(Platform.OS === "ios");
                  if (currentDate && !isDateOccupied(currentDate)) {
                    setSelectedStartDate(currentDate);
                    if (selectedEndDate && currentDate > selectedEndDate) {
                      setSelectedEndDate(null);
                    }
                  } else if (currentDate && isDateOccupied(currentDate)) {
                    console.warn("Data inicial selecionada está ocupada.");
                    
                  }
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={[
                styles.dateButton,
                !selectedStartDate && styles.disabledButton,
              ]}
              disabled={!selectedStartDate}
            >
              <Text style={selectedStartDate ? {} : styles.disabledButtonText}>
                {selectedEndDate
                  ? selectedEndDate.toLocaleString("pt-BR", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "Data e Hora Final"}
              </Text>
            </TouchableOpacity>
            {showEndPicker && selectedStartDate && (
              <DateTimePicker
                value={selectedEndDate || selectedStartDate}
                mode="datetime"
                display="default"
                minimumDate={selectedStartDate}
                onChange={(event, date) => {
                  const currentDate = date || selectedEndDate;
                  setShowEndPicker(Platform.OS === "ios");
                  setSelectedEndDate(currentDate);
                }}
              />
            )}

            <TextInput
              style={styles.textArea}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Adicione observações (opcional)"
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closePopup}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!selectedStartDate ||
                    !selectedEndDate ||
                    selectedEndDate <= selectedStartDate) &&
                    styles.disabledButton,
                ]}
                onPress={handleConfirmation}
                disabled={
                  !selectedStartDate ||
                  !selectedEndDate ||
                  selectedEndDate <= selectedStartDate
                }
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showConfirmationPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contratação Confirmada!</Text>
            <Text>
              A contratação da assistência técnica{" "}
              {selectedAssistenciaTecnica?.nome} foi realizada com sucesso!
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleRedirect}
            >
              <Text style={styles.buttonText}>Ver Solicitações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#075985" },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  filterContainer: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#075985" },
  cardText: { color: "#4b5563", marginBottom: 5 },
  cardPrice: { fontWeight: "600", color: "#0284c7", marginTop: 5 },
  whatsappButton: { marginTop: 10 },
  whatsappText: { color: "#22c55e", fontWeight: "bold" },
  hireButton: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  noDataText: { color: "#fff", textAlign: "center", marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075985",
    marginBottom: 15,
    textAlign: "center",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#d1d5db",
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0284c7",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#6b7280",
  },
});

export default AssistenciaTecnica;
