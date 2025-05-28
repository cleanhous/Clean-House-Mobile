import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput, // Mantido para o TextInput de observações no modal
  Modal,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../services/api";
import NavBarHome from "../NavBarHome";
import FiltroPrestadores from "../FiltroPrestadores"; // IMPORTANDO O SEU COMPONENTE DE FILTRO

// Função auxiliar para formatar data para API (YYYY-MM-DD) - para filtros
// Esta função é usada internamente pelo FiltroPrestadores também, mas é bom ter aqui
// para a lógica de busca de prestadores.
const formatarDataParaAPIFiltro = (data) => {
  if (!data || !(data instanceof Date)) return null;
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export default function Diarista() {
  // Estados de Filtro
  const [nota, definirNota] = useState("");
  const [precoMin, definirPrecoMin] = useState("");
  const [precoMax, definirPrecoMax] = useState("");
  const [dataFiltroInicio, definirDataFiltroInicio] = useState(null);
  const [dataFiltroFim, definirDataFiltroFim] = useState(null);
  const [mostrarSeletorDataInicio, definirMostrarSeletorDataInicio] =
    useState(false);
  const [mostrarSeletorDataFim, definirMostrarSeletorDataFim] = useState(false);

  // Estados de Dados dos Prestadores
  const [prestadores, definirPrestadores] = useState([]);
  const [prestadoresFiltrados, definirPrestadoresFiltrados] = useState([]);
  const [prestadorSelecionado, definirPrestadorSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados do Modal de Contratação
  const [modalCalendarioVisivel, setModalCalendarioVisivel] = useState(false);
  const [dataInicioContratacao, setDataInicioContratacao] = useState(null);
  const [dataFimContratacao, setDataFimContratacao] = useState(null);
  const [datasOcupadas, definirDatasOcupadas] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [popupConfirmacao, setPopupConfirmacao] = useState(false);

  const [mostrarPickerInicioContratacao, setMostrarPickerInicioContratacao] =
    useState(false);
  const [mostrarPickerFimContratacao, setMostrarPickerFimContratacao] =
    useState(false);

  const navegacao = useNavigation();

  async function buscarPrestadoresComFiltros() {
    setLoading(true);
    try {
      let endpoint = "/diarista";
      const params = new URLSearchParams();
      const dataInicioFormatada = formatarDataParaAPIFiltro(dataFiltroInicio);
      const dataFimFormatada = formatarDataParaAPIFiltro(dataFiltroFim);

      // Adapte esta lógica se a API de diaristas tiver parâmetros diferentes
      // para disponibilidade ou se não suportar filtro por data na listagem.
      if (dataInicioFormatada) {
        params.append("disponivel_de", dataInicioFormatada);
      }
      if (dataFimFormatada) {
        params.append("disponivel_ate", dataFimFormatada);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const resposta = await api.get(endpoint);
      const dadosRecebidos = Array.isArray(resposta.data) ? resposta.data : [];
      definirPrestadores(dadosRecebidos);
      aplicarFiltrosLocais(dadosRecebidos);
    } catch (erro) {
      Alert.alert("Erro na Busca", "Não foi possível buscar diaristas.");
      console.error(
        "Erro ao buscar diaristas:",
        erro.response?.data || erro.message || erro
      );
      definirPrestadores([]);
      definirPrestadoresFiltrados([]);
    } finally {
      setLoading(false);
    }
  }

  function aplicarFiltrosLocais(listaBase) {
    let filtrados = [...listaBase];
    if (nota && !isNaN(parseInt(nota))) {
      filtrados = filtrados.filter(
        (item) => parseInt(item.nota, 10) === parseInt(nota, 10)
      );
    }
    if (precoMin && !isNaN(parseFloat(precoMin))) {
      filtrados = filtrados.filter(
        (item) => parseFloat(item.preco) >= parseFloat(precoMin)
      );
    }
    if (precoMax && !isNaN(parseFloat(precoMax))) {
      filtrados = filtrados.filter(
        (item) => parseFloat(item.preco) <= parseFloat(precoMax)
      );
    }
    definirPrestadoresFiltrados(filtrados);
  }

  useEffect(() => {
    buscarPrestadoresComFiltros(); // Busca inicial sem filtros de data da API, apenas locais
  }, []);

  function aoAplicarTodosOsFiltrosHandler() {
    // Se os filtros de data são aplicados pela API, chame buscarPrestadoresComFiltros.
    // Se todos os filtros (incluindo data) são locais após uma busca inicial,
    // então chame aplicarFiltrosLocais(prestadores) aqui.
    // Pelo seu FiltroPrestadores, parece que a intenção é buscar na API com as datas.
    buscarPrestadoresComFiltros();
  }

  // Handler para mudanças de data no FiltroPrestadores
  const lidarComMudancaDataFiltro = (
    setter,
    dataSelecionada,
    evento,
    pickerSetter
  ) => {
    pickerSetter(Platform.OS === "ios"); // Mantém picker aberto no iOS até o usuário dispensar
    if (evento.type === "set" && dataSelecionada) {
      setter(dataSelecionada);
      if (
        setter === definirDataFiltroInicio &&
        dataFiltroFim &&
        dataSelecionada > dataFiltroFim
      ) {
        definirDataFiltroFim(null);
        Alert.alert(
          "Atenção",
          "A data final do filtro foi redefinida, pois era anterior à nova data de início."
        );
      }
      if (
        setter === definirDataFiltroFim &&
        dataFiltroInicio &&
        dataSelecionada < dataFiltroInicio
      ) {
        Alert.alert(
          "Data Inválida",
          "A data final do filtro não pode ser anterior à data de início."
        );
        setter(null);
      }
    } else if (evento.type === "dismissed") {
      pickerSetter(false);
    }
  };

  const aoMudarDataInicioFiltroHandler = (evento, dataSelecionada) => {
    lidarComMudancaDataFiltro(
      definirDataFiltroInicio,
      dataSelecionada,
      evento,
      definirMostrarSeletorDataInicio
    );
  };

  const aoMudarDataFimFiltroHandler = (evento, dataSelecionada) => {
    lidarComMudancaDataFiltro(
      definirDataFiltroFim,
      dataSelecionada,
      evento,
      definirMostrarSeletorDataFim
    );
  };

  async function verAgenda(item) {
    definirPrestadorSelecionado(item);
    setDataInicioContratacao(null);
    setDataFimContratacao(null);
    setObservacoes("");
    definirDatasOcupadas([]);
    setLoading(true);
    try {
      const { data } = await api.get(`/prestadores/${item.id}/schedule`);
      definirDatasOcupadas(Array.isArray(data) ? data : []);
      setModalCalendarioVisivel(true);
    } catch (erro) {
      Alert.alert(
        "Erro na Agenda",
        "Não foi possível carregar a agenda da diarista."
      );
      console.error(
        "Erro ao carregar agenda:",
        erro.response?.data || erro.message || erro
      );
    } finally {
      setLoading(false);
    }
  }

  function formatarDataHoraContratacao(dataHoraCompleta) {
    if (!dataHoraCompleta || !(dataHoraCompleta instanceof Date)) return null;
    const ano = dataHoraCompleta.getFullYear();
    const mes = String(dataHoraCompleta.getMonth() + 1).padStart(2, "0");
    const dia = String(dataHoraCompleta.getDate()).padStart(2, "0");
    const hora = String(dataHoraCompleta.getHours()).padStart(2, "0");
    const minuto = String(dataHoraCompleta.getMinutes()).padStart(2, "0");
    return `${ano}-${mes}-${dia} ${hora}:${minuto}:00`;
  }

  const isDateOccupiedContratacao = (dateToCheck, schedule) => {
    const targetDate = new Date(dateToCheck);
    targetDate.setHours(0, 0, 0, 0);

    return schedule.some((item) => {
      const start = new Date(item.data_inicio);
      const end = new Date(item.data_fim);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return targetDate >= start && targetDate <= end;
    });
  };

  async function confirmarContratacao() {
    if (!dataInicioContratacao || !dataFimContratacao) {
      Alert.alert("Dados incompletos", "Selecione data/hora de início e fim.");
      return;
    }
    if (dataFimContratacao <= dataInicioContratacao) {
      Alert.alert(
        "Período Inválido",
        "A data/hora final deve ser posterior à data/hora inicial."
      );
      return;
    }

    let currentDateCheck = new Date(dataInicioContratacao);
    currentDateCheck.setHours(0, 0, 0, 0);
    let endDateCheckLimit = new Date(dataFimContratacao);
    endDateCheckLimit.setHours(0, 0, 0, 0);

    while (currentDateCheck <= endDateCheckLimit) {
      if (isDateOccupiedContratacao(currentDateCheck, datasOcupadas)) {
        Alert.alert(
          "Período Indisponível",
          `A data ${currentDateCheck.toLocaleDateString(
            "pt-BR"
          )} no intervalo selecionado está ocupada.`
        );
        return;
      }
      currentDateCheck.setDate(currentDateCheck.getDate() + 1);
    }

    setLoading(true);
    try {
      const inicioSQL = formatarDataHoraContratacao(dataInicioContratacao);
      const fimSQL = formatarDataHoraContratacao(dataFimContratacao);

      if (!inicioSQL || !fimSQL) {
        Alert.alert(
          "Erro de Formatação",
          "Data/hora inválida para a contratação."
        );
        setLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem("acessToken");
      if (!token) {
        Alert.alert("Autenticação Necessária", "Faça login para prosseguir.");
        setLoading(false);
        navegacao.navigate("Login");
        return;
      }

      await api.post(
        "/contrato",
        {
          prestadorId: prestadorSelecionado.id,
          dataInicio: inicioSQL,
          dataFim: fimSQL,
          observacao: observacoes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalCalendarioVisivel(false);
      setPopupConfirmacao(true);
    } catch (erro) {
      Alert.alert(
        "Erro na Contratação",
        erro.response?.data?.message || "Falha ao confirmar."
      );
      console.error(
        "Erro ao confirmar contratação:",
        erro.response?.data || erro.message || erro
      );
    } finally {
      setLoading(false);
    }
  }

  function redirecionar() {
    setPopupConfirmacao(false);
    // Resetar estados para nova busca/contratação opcionalmente
    definirPrestadorSelecionado(null);
    setDataInicioContratacao(null);
    setDataFimContratacao(null);
    setObservacoes("");

    navegacao.navigate("Pedidos");
  }

  function formatarPreco(valor) {
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "Preço indisponível";
    return `R$ ${numero.toFixed(2).replace(".", ",")} por diária`;
  }

  const fecharModalContratacao = () => {
    setModalCalendarioVisivel(false);
    definirPrestadorSelecionado(null);
    setDataInicioContratacao(null);
    setDataFimContratacao(null);
    setObservacoes("");
    setMostrarPickerInicioContratacao(false);
    setMostrarPickerFimContratacao(false);
  };

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.scrollContentContainer}
    >
      <NavBarHome title={"Diarista"} />
      <View style={estilos.content}>
        <Text style={estilos.title}>Serviços de Diarista</Text>
        <Text style={estilos.subtitle}>
          Encontre diaristas qualificadas para suas necessidades.
        </Text>

        {/* USANDO FiltroPrestadores AQUI */}
        <FiltroPrestadores
          nota={nota}
          definirNota={definirNota}
          precoMin={precoMin}
          definirPrecoMin={definirPrecoMin}
          precoMax={precoMax}
          definirPrecoMax={definirPrecoMax}
          valorDataFiltroInicio={dataFiltroInicio}
          // setDataFiltroInicio={definirDataFiltroInicio} // FiltroPrestadores não usa setDataFiltroInicio diretamente
          valorDataFiltroFim={dataFiltroFim}
          // setDataFiltroFim={definirDataFiltroFim}     // FiltroPrestadores não usa setDataFiltroFim diretamente
          mostrarSeletorDataInicio={mostrarSeletorDataInicio}
          definirMostrarSeletorDataInicio={definirMostrarSeletorDataInicio}
          mostrarSeletorDataFim={mostrarSeletorDataFim}
          definirMostrarSeletorDataFim={definirMostrarSeletorDataFim}
          aoMudarDataInicioFiltro={aoMudarDataInicioFiltroHandler}
          aoMudarDataFimFiltro={aoMudarDataFimFiltroHandler}
          aoAplicarTodosOsFiltros={aoAplicarTodosOsFiltrosHandler}
        />

        {/* DateTimePickers para o Filtro permanecem aqui, controlados pelo Diarista e passados para FiltroPrestadores */}
        {/* O FiltroPrestadores já tem a lógica para exibir os DateTimePickers quando mostrarSeletorDataInicio/Fim é true */}
        {/* Portanto, não precisamos renderizá-los explicitamente aqui novamente se FiltroPrestadores os maneja */}

        <Text style={estilos.sectionTitle}>Nossas Diaristas</Text>
        {loading && !modalCalendarioVisivel && !popupConfirmacao ? (
          <Text style={estilos.noDataText}>Carregando diaristas...</Text>
        ) : prestadoresFiltrados.length > 0 ? (
          prestadoresFiltrados.map((item) => (
            <View key={item.id || item.nome} style={estilos.card}>
              <View style={estilos.cardHeader}>
                <Text style={estilos.cardTitle}>
                  {item.nome || "Nome não disponível"}
                </Text>
              </View>
              <Text style={estilos.cardText}>
                {item.titulo || "Título não disponível"}
              </Text>
              <Text style={estilos.cardText}>
                {item.descricao || "Descrição não disponível"}
              </Text>
              <Text style={estilos.cardPrice}>{formatarPreco(item.preco)}</Text>
              <View style={estilos.ratingContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Text
                    key={index}
                    style={[
                      estilos.star,
                      index < Math.floor(parseFloat(item.nota) || 0)
                        ? estilos.starFilled
                        : estilos.starEmpty,
                    ]}
                  >
                    ★
                  </Text>
                ))}
                <Text style={estilos.ratingText}>({item.nota || "N/A"})</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const tel = item.telefone?.replace(/[^\d]/g, "");
                  if (tel) Linking.openURL(`https://wa.me/55${tel}`);
                  else
                    Alert.alert(
                      "Contato Indisponível",
                      "WhatsApp não fornecido."
                    );
                }}
                style={estilos.botaoWhatsapp}
              >
                <Text style={estilos.textoBotaoWhatsapp}>
                  Contato via WhatsApp
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.botaoContratar}
                onPress={() => verAgenda(item)}
              >
                <Text style={estilos.textoBotao}>Ver Agenda e Contratar</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={estilos.noDataText}>
            Nenhuma diarista encontrada com os filtros aplicados.
          </Text>
        )}
      </View>

      {prestadorSelecionado && (
        <Modal
          visible={modalCalendarioVisivel}
          transparent
          animationType="slide"
          onRequestClose={fecharModalContratacao}
        >
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalContent}>
              <Text style={estilos.modalTitle}>
                Disponibilidade de {prestadorSelecionado?.nome}
              </Text>
              <Text style={estilos.modalSubtitle}>
                Selecione a data e o horário desejado:
              </Text>

              <Text style={estilos.labelDataHora}>Data e Hora de Início:</Text>
              <TouchableOpacity
                onPress={() => setMostrarPickerInicioContratacao(true)}
                style={estilos.dateButtonModal}
              >
                <Text style={estilos.dateButtonTextModal}>
                  {dataInicioContratacao
                    ? dataInicioContratacao.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Selecionar Início"}
                </Text>
              </TouchableOpacity>
              {mostrarPickerInicioContratacao && (
                <DateTimePicker
                  value={dataInicioContratacao || new Date()}
                  mode="datetime"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    const currentDate = date || dataInicioContratacao; // Mantém a data anterior se o usuário cancelar (Android)
                    setMostrarPickerInicioContratacao(Platform.OS === "ios");
                    if (event.type === "set" && currentDate) {
                      setDataInicioContratacao(currentDate);
                      if (
                        dataFimContratacao &&
                        currentDate > dataFimContratacao
                      ) {
                        setDataFimContratacao(null);
                      }
                    }
                  }}
                />
              )}

              <Text style={estilos.labelDataHora}>Data e Hora de Fim:</Text>
              <TouchableOpacity
                onPress={() => setMostrarPickerFimContratacao(true)}
                style={[
                  estilos.dateButtonModal,
                  !dataInicioContratacao && estilos.disabledButton,
                ]}
                disabled={!dataInicioContratacao}
              >
                <Text
                  style={[
                    estilos.dateButtonTextModal,
                    !dataInicioContratacao && estilos.disabledButtonTextContent,
                  ]}
                >
                  {dataFimContratacao
                    ? dataFimContratacao.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Selecionar Fim"}
                </Text>
              </TouchableOpacity>
              {mostrarPickerFimContratacao && dataInicioContratacao && (
                <DateTimePicker
                  value={dataFimContratacao || dataInicioContratacao} // Garante que o picker inicie com uma data válida
                  mode="datetime"
                  display="default"
                  minimumDate={dataInicioContratacao}
                  onChange={(event, date) => {
                    const currentDate = date || dataFimContratacao;
                    setMostrarPickerFimContratacao(Platform.OS === "ios");
                    if (event.type === "set" && currentDate) {
                      setDataFimContratacao(currentDate);
                    }
                  }}
                />
              )}

              <TextInput
                style={estilos.textArea}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Adicione observações (opcional)"
                multiline
              />
              <View style={estilos.modalButtons}>
                <TouchableOpacity
                  style={estilos.cancelButtonModal}
                  onPress={fecharModalContratacao}
                >
                  <Text style={estilos.buttonTextModalCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    estilos.confirmButtonModal,
                    (!dataInicioContratacao ||
                      !dataFimContratacao ||
                      dataFimContratacao <= dataInicioContratacao ||
                      loading) &&
                      estilos.disabledButton,
                  ]}
                  onPress={confirmarContratacao}
                  disabled={
                    !dataInicioContratacao ||
                    !dataFimContratacao ||
                    dataFimContratacao <= dataInicioContratacao ||
                    loading
                  }
                >
                  <Text style={estilos.buttonTextModalConfirm}>
                    {loading ? "Confirmando..." : "Confirmar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={popupConfirmacao}
        transparent
        animationType="slide"
        onRequestClose={redirecionar}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitle}>Contratação Confirmada!</Text>
            <Text style={estilos.modalTextConfirmation}>
              A contratação da diarista {prestadorSelecionado?.nome} foi
              realizada com sucesso!
            </Text>
            <TouchableOpacity
              style={estilos.confirmButtonPopup}
              onPress={redirecionar}
            >
              <Text style={estilos.buttonText}>Ver Solicitações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Estilos (os mesmos da sua última mensagem, apenas com o nome 'estilos')
const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#075985" },
  scrollContentContainer: { paddingBottom: 30 },
  content: { paddingHorizontal: 20, paddingTop: 10 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0f2fe",
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#075985" },
  cardText: { fontSize: 15, color: "#475569", lineHeight: 22, marginBottom: 5 },
  cardPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0369a1",
    marginTop: 8,
    marginBottom: 12,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  star: { fontSize: 18, marginRight: 3 },
  starFilled: { color: "#FBBF24" },
  starEmpty: { color: "#D1D5DB" },
  ratingText: { marginLeft: 6, color: "#4B5563", fontSize: 14 },

  botaoWhatsapp: {
    backgroundColor: "#25D366",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  textoBotaoWhatsapp: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 0,
  },
  botaoContratar: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  textoBotao: { color: "#fff", fontWeight: "600", fontSize: 16 },

  noDataText: {
    color: "#bae6fd",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 20,
    fontStyle: "italic",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: "95%",
    maxWidth: 450,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#075985",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  labelDataHora: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "500",
  },
  dateButtonModal: {
    paddingVertical: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  dateButtonTextModal: { color: "#1f2937", fontSize: 15 },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 5,
    padding: 12,
    height: 100,
    marginBottom: 20,
    textAlignVertical: "top",
    backgroundColor: "#f9fafb",
    fontSize: 15,
    color: "#334155",
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButtonModal: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
  },
  buttonTextModalCancel: { color: "#374151", fontWeight: "600", fontSize: 15 },
  confirmButtonModal: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#0ea5e9",
    borderRadius: 5,
  },
  buttonTextModalConfirm: { color: "#fff", fontWeight: "600", fontSize: 15 },

  disabledButton: { backgroundColor: "#d1d5db", opacity: 0.7 },
  disabledButtonTextContent: { color: "#6b7280" },

  modalTextConfirmation: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  confirmButtonPopup: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
});
