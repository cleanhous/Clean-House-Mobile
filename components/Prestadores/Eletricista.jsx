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
import api from "../../services/api";

const NavBarHome = () => (
  <View style={[styles.navBar, { paddingTop: 40 }]}>
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
        <Text style={styles.buttonText}>Filtrar Eletricistas</Text>
      </TouchableOpacity>
    </View>
  );
};


const Eletricista = () => {
  const [filtroNota, setFiltroNota] = useState("");
  const [precoDe, setPrecoDe] = useState("");
  const [precoAte, setPrecoAte] = useState("");
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);

  
  const [eletricistas, setEletricistas] = useState([]);
  const [filteredEletricistas, setFilteredEletricistas] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  
  const [selectedEletricista, setSelectedEletricista] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [prestadorSchedule, setPrestadorSchedule] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation();

  
  const fetchEletricistas = async () => {
    try {
      const response = await api.get("/eletricista"); 
      setEletricistas(response.data);
      setFilteredEletricistas(response.data); 
    } catch (error) {
      
      console.error("Erro ao buscar eletricistas:", error);
    }
  };

  useEffect(() => {
    fetchEletricistas(); 
  }, []);

  useEffect(() => {
    
    if (selectedEletricista) {
      api
        
        .get(`/prestadores/${selectedEletricista.id}/schedule`)
        .then((response) => {
          setPrestadorSchedule(response.data);
        })
        .catch((error) => {
          
          console.error("Erro ao buscar agenda do eletricista:", error);
        });
    }
  
  }, [selectedEletricista]);

  
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
      let response;
      if (dataInicial && dataFinal) {
        response = await api.get("/prestadores-disponiveis/eletricista", { 
          params: {
            dataInicio: dataInicial.toISOString(),
            dataFim: dataFinal.toISOString(),
          },
        });
      } else {
        response = await api.get("/eletricista"); 
      }

      const data = response.data;

      
      const filtered = data.filter((eletricista) => {
        let matches = true;
        if (filtroNota)
          matches =
           
            matches && parseInt(eletricista.nota) === parseInt(filtroNota);
        if (precoDe)
         
          matches = matches && eletricista.preco >= parseFloat(precoDe);
        if (precoAte)
          
          matches = matches && eletricista.preco <= parseFloat(precoAte);
        return matches;
      });

      setFilteredEletricistas(filtered); 
    } catch (error) {
      
      console.error("Erro ao buscar eletricistas:", error);
    }
  };

  
  const handleCheckAvailability = (eletricista) => {
    setSelectedEletricista(eletricista); 
    setShowPopup(true);
  };

  
  const closePopup = () => {
    setShowPopup(false);
    setSelectedEletricista(null); 
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setObservacoes("");

    setShowStartPicker(false);
    setShowEndPicker(false);
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

      const token = await AsyncStorage.getItem("acessToken");

      const response = await api.post(
        "/contrato",
        {
          
          prestadorId: selectedEletricista.id,
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
      <NavBarHome />
      <View style={styles.content}>
        <Text style={styles.title}>Serviços de Eletricista</Text>
        <Text style={styles.subtitle}>
          Encontre eletricistas qualificados para suas necessidades elétricas,
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

        
        <Text style={styles.sectionTitle}>Nossos Eletricistas</Text>
        
        {filteredEletricistas.length > 0 ? (
          filteredEletricistas.map((eletricista) => ( 
            <View key={eletricista.id} style={styles.card}>
              <View style={styles.cardHeader}>
                
                <Text style={styles.cardTitle}>{eletricista.nome}</Text>
              </View>
             
              <Text style={styles.cardText}>{eletricista.titulo}</Text>
              <Text style={styles.cardText}>{eletricista.descricao}</Text>
              <Text style={styles.cardPrice}>
                
                {formatarPreco(eletricista.preco)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    
                    `https://wa.me/55${eletricista.telefone.replace(
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
                
                onPress={() => handleCheckAvailability(eletricista)}
              >
                <Text style={styles.buttonText}>
                  
                  Contratar {eletricista.nome}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            Nenhum eletricista disponível com os filtros selecionados.
          </Text>
        )}
      </View>
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Disponibilidade de {selectedEletricista?.nome}
            </Text>
            <Text>Selecione a data e o horário desejado:</Text>

            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              <Text>
                {selectedStartDate
                  ? selectedStartDate.toLocaleString("pt-BR")
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
                  : "Data e Hora Final"}
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
             
              A contratação do eletricista {selectedEletricista?.nome} foi
              realizada com sucesso!
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


export default Eletricista;