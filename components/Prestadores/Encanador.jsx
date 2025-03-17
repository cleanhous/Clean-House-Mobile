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
// import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";


const NavBarHome = () => (
  <View style={styles.navBar}>
    <Text style={styles.navText}>Home</Text>
  </View>
);

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
            setShowStartDate(false);
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
            setShowEndDate(false);
            if (date) setDataFinal(date);
          }}
        />
      )}
      <TouchableOpacity style={styles.filterButton} onPress={onFiltrar}>
        <Text style={styles.buttonText}>Filtrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const Encanador = () => {

  const [filtroNota, setFiltroNota] = useState("");
  const [precoDe, setPrecoDe] = useState("");
  const [precoAte, setPrecoAte] = useState("");
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);

  const [encanadores, setEncanadores] = useState([]);
  const [filteredEncanadores, setFilteredEncanadores] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedEncanador, setSelectedEncanador] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [prestadorSchedule, setPrestadorSchedule] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation();

  const fetchEncanadores = async () => {
    try {
      const response = await fetch(
        "https:hopeful-youth-production-8fe2.up.railway.app/encanador"
      );
      const data = await response.json();
      setEncanadores(data);
      setFilteredEncanadores(data);
    } catch (error) {
      console.error("Erro ao buscar encanadores:", error);
    }
  };

  useEffect(() => {
    fetchEncanadores();
  }, []);

  useEffect(() => {
    if (selectedEncanador) {
      axios
        .get(
          `https:hopeful-youth-production-8fe2.up.railway.app/prestadores/${selectedEncanador.id}/schedule`
        )
        .then((response) => {
          setPrestadorSchedule(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar agenda:", error);
        });
    }
  }, [selectedEncanador]);

  const isDateOccupied = (date) => {
    return prestadorSchedule.some((item) => {
      const start = new Date(item.data_inicio);
      const end = new Date(item.data_fim);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      date.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    });
  };

  const handleFiltrar = async () => {
    try {
      let data = [];
      if (dataInicial && dataFinal) {
        const queryParams = new URLSearchParams({
          dataInicio: dataInicial.toISOString(),
          dataFim: dataFinal.toISOString(),
        });
        const response = await fetch(
          `https:hopeful-youth-production-8fe2.up.railway.app/prestadores-disponiveis/encanador?${queryParams}`
        );
        data = await response.json();
      } else {
        const response = await fetch(
          "https:hopeful-youth-production-8fe2.up.railway.app/encanador"
        );
        data = await response.json();
      }

      const filtered = data.filter((encanador) => {
        let matches = true;
        if (filtroNota)
          matches =
            matches && parseInt(encanador.nota) === parseInt(filtroNota);
        if (precoDe)
          matches = matches && encanador.preco >= parseFloat(precoDe);
        if (precoAte)
          matches = matches && encanador.preco <= parseFloat(precoAte);
        return matches;
      });

      setFilteredEncanadores(filtered);
    } catch (error) {
      console.error("Erro ao buscar encanadores:", error);
    }
  };

  const handleCheckAvailability = (encanador) => {
    setSelectedEncanador(encanador);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEncanador(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setObservacoes("");
  };

  const handleConfirmation = async () => {
    try {
      const dataInicioFormatted = selectedStartDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const dataFimFormatted = selectedEndDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const response = await fetch(
        "https://backend-production-ce19.up.railway.app/contrato",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            prestadorId: selectedEncanador.id,
            dataInicio: dataInicioFormatted,
            dataFim: dataFimFormatted,
            observacao: observacoes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao confirmar contratação:", errorData);
      } else {
        console.log("Contratação confirmada com sucesso");
        setShowPopup(false);
        setShowConfirmationPopup(true);
      }
    } catch (error) {
      console.error("Erro ao confirmar contratação:", error);
    }
  };

  const handleRedirect = () => {
    navigation.navigate("Pedidos"); 
  };

  const formatarPreco = (preco) => {
    return `R$ ${parseFloat(preco).toFixed(2)} por diária`;
  };

  return (
    <ScrollView style={styles.container}>
      <NavBarHome />
      <View style={styles.content}>
        <Text style={styles.title}>Serviços de Encanador</Text>
        <Text style={styles.subtitle}>
          Oferecemos serviços de encanador de alta qualidade, garantindo
          segurança e eficiência.
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

        <Text style={styles.sectionTitle}>Nossos Encanadores</Text>
        {filteredEncanadores.length > 0 ? (
          filteredEncanadores.map((encanador) => (
            <View key={encanador.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{encanador.nome}</Text>
               
              </View>
              <Text style={styles.cardText}>{encanador.titulo}</Text>
              <Text style={styles.cardText}>{encanador.descricao}</Text>
              <Text style={styles.cardPrice}>
                {formatarPreco(encanador.preco)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/55${encanador.telefone.replace(
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
                onPress={() => handleCheckAvailability(encanador)}
              >
                <Text style={styles.buttonText}>
                  Contratar {encanador.nome}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            Nenhum encanador disponível no momento.
          </Text>
        )}
      </View>

      <Modal visible={showPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Disponibilidade de {selectedEncanador?.nome}
            </Text>
            <Text>Selecione a data e o horário desejado:</Text>

            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              <Text>
                {selectedStartDate
                  ? selectedStartDate.toLocaleString("pt-BR")
                  : "Data Inicial"}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={selectedStartDate || new Date()}
                mode="datetime"
                display="default"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date && !isDateOccupied(date)) setSelectedStartDate(date);
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.dateButton}
              disabled={!selectedStartDate}
            >
              <Text>
                {selectedEndDate
                  ? selectedEndDate.toLocaleString("pt-BR")
                  : "Data Final"}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={selectedEndDate || selectedStartDate || new Date()}
                mode="datetime"
                display="default"
                minimumDate={selectedStartDate}
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setSelectedEndDate(date);
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
                style={styles.confirmButton}
                onPress={handleConfirmation}
                disabled={!selectedStartDate || !selectedEndDate}
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
              A contratação do encanador {selectedEncanador?.nome} foi realizada
              com sucesso!
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
  navBar: { padding: 10, backgroundColor: "#0284c7" },
  navText: { color: "#fff", fontSize: 18 },
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
  cardText: { color: "#4b5563" },
  cardPrice: { fontWeight: "600", color: "#0284c7" },
  whatsappButton: { marginTop: 10 },
  whatsappText: { color: "#22c55e" },
  hireButton: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  noDataText: { color: "#fff", textAlign: "center" },
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
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075985",
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  cancelButton: {
    padding: 10,
    backgroundColor: "#d1d5db",
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: "#0284c7",
    borderRadius: 5,
  },
});

export default Encanador;
