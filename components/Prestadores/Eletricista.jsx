import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import FiltroPrestadores from "../FiltroPrestadores";
import CalendarioContratacao from "../CalendarioContratacao";
import NavBarHome from "../NavBarHome";

const formatarDataParaAPI = (data) => {
  if (!data) return null;
  if (!(data instanceof Date)) {
    console.warn("formatarDataParaAPI: 'data' não é um objeto Date.", data);
    return null;
  }
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export default function Eletricista() {
  const [nota, definirNota] = useState("");
  const [precoMin, definirPrecoMin] = useState("");
  const [precoMax, definirPrecoMax] = useState("");
  const [dataFiltroInicio, definirDataFiltroInicio] = useState(null);
  const [dataFiltroFim, definirDataFiltroFim] = useState(null);
  const [mostrarSeletorDataInicio, definirMostrarSeletorDataInicio] =
    useState(false);
  const [mostrarSeletorDataFim, definirMostrarSeletorDataFim] = useState(false);
  const [prestadores, definirPrestadores] = useState([]);
  const [prestadoresFiltrados, definirPrestadoresFiltrados] = useState([]);
  const [prestadorSelecionado, definirPrestadorSelecionado] = useState(null);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [datasOcupadas, definirDatasOcupadas] = useState({});
  const [mostrarHorarioInicial, setMostrarHorarioInicial] = useState(false);
  const [mostrarHorarioFinal, setMostrarHorarioFinal] = useState(false);
  const [horarioInicial, setHorarioInicial] = useState(null);
  const [horarioFinal, setHorarioFinal] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [modalCalendarioVisivel, setModalCalendarioVisivel] = useState(false);
  const [popupConfirmacao, setPopupConfirmacao] = useState(false);

  const navegacao = useNavigation();

  async function buscarPrestadoresComFiltros() {
    try {
      let endpoint = "/eletricista";
      const params = new URLSearchParams();

      const dataInicioFormatada = formatarDataParaAPI(dataFiltroInicio);
      const dataFimFormatada = formatarDataParaAPI(dataFiltroFim);

      if (dataInicioFormatada) {
        params.append("disponivel_de", dataInicioFormatada);
      }
      if (dataFimFormatada) {
        params.append("disponivel_ate", dataFimFormatada);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      console.log("Buscando prestadores com endpoint:", endpoint);
      const resposta = await api.get(endpoint);
      definirPrestadores(resposta.data);
      aplicarFiltrosLocais(resposta.data);
    } catch (erro) {
      Alert.alert(
        "Erro na Busca",
        "Não foi possível buscar prestadores. Verifique sua conexão ou tente mais tarde."
      );
      console.error(
        "Erro ao buscar prestadores:",
        erro.response?.data || erro.message || erro
      );
      definirPrestadores([]);
      definirPrestadoresFiltrados([]);
    }
  }

  function aplicarFiltrosLocais(listaBase) {
    let filtrados = [...listaBase];
    if (nota) {
      filtrados = filtrados.filter(
        (item) => parseInt(item.nota, 10) === parseInt(nota, 10)
      );
    }
    if (precoMin) {
      filtrados = filtrados.filter(
        (item) => item.preco >= parseFloat(precoMin)
      );
    }
    if (precoMax) {
      filtrados = filtrados.filter(
        (item) => item.preco <= parseFloat(precoMax)
      );
    }
    definirPrestadoresFiltrados(filtrados);
  }

  useEffect(() => {
    buscarPrestadoresComFiltros();
  }, []);

  function aoAplicarTodosOsFiltrosHandler() {
    buscarPrestadoresComFiltros();
  }

  const lidarComMudancaDataInicio = (evento, dataSelecionada) => {
    definirMostrarSeletorDataInicio(
      Platform.OS === "ios" ? (evento.type === "set" ? false : true) : false
    );

    if (evento.type === "set" && dataSelecionada) {
      definirDataFiltroInicio(dataSelecionada);
      if (dataFiltroFim && dataSelecionada > dataFiltroFim) {
        definirDataFiltroFim(null);
        Alert.alert(
          "Atenção",
          "A data final foi redefinida pois era anterior à nova data de início."
        );
      }
    } else if (evento.type === "dismissed") {
      definirMostrarSeletorDataInicio(false);
    }
  };

  const lidarComMudancaDataFim = (evento, dataSelecionada) => {
    definirMostrarSeletorDataFim(
      Platform.OS === "ios" ? (evento.type === "set" ? false : true) : false
    );

    if (evento.type === "set" && dataSelecionada) {
      if (dataFiltroInicio && dataSelecionada < dataFiltroInicio) {
        Alert.alert(
          "Data Inválida",
          "A data final não pode ser anterior à data de início."
        );
        return;
      }
      definirDataFiltroFim(dataSelecionada);
    } else if (evento.type === "dismissed") {
      definirMostrarSeletorDataFim(false);
    }
  };

  async function verAgenda(item) {
    definirPrestadorSelecionado(item);
    setDataInicio(null);
    setDataFim(null);
    setHorarioInicial(null);
    setHorarioFinal(null);
    setObservacoes("");

    try {
      const { data } = await api.get(`/prestadores/${item.id}/schedule`);
      const marcacoes = {};

      (Array.isArray(data) ? data : []).forEach((evento) => {
        if (evento.data_inicio && evento.data_fim) {
          const inicio = new Date(evento.data_inicio);
          const fim = new Date(evento.data_fim);
          let atual = new Date(inicio.valueOf());
          while (atual <= fim) {
            const ano = atual.getFullYear();
            const mes = String(atual.getMonth() + 1).padStart(2, "0");
            const dia = String(atual.getDate()).padStart(2, "0");
            const chave = `${ano}-${mes}-${dia}`;
            marcacoes[chave] = {
              disabled: true,
              marked: true,
              dotColor: "red",
              disableTouchEvent: true,
            };
            atual.setDate(atual.getDate() + 1);
          }
        }
      });
      definirDatasOcupadas(marcacoes);
      setModalCalendarioVisivel(true);
    } catch (erro) {
      Alert.alert(
        "Erro na Agenda",
        "Não foi possível carregar a agenda do prestador."
      );
      console.error(
        "Erro ao carregar agenda:",
        erro.response?.data || erro.message || erro
      );
    }
  }

  function formatarData(diaISO, hora) {
    if (!diaISO || !hora || !(hora instanceof Date)) return null;
    const [ano, mes, dia] = diaISO.split("-");
    const hh = String(hora.getHours()).padStart(2, "0");
    const mm = String(hora.getMinutes()).padStart(2, "0");
    return `${ano}-${mes}-${dia} ${hh}:${mm}:00`;
  }

  async function confirmarContratacao() {
    if (!dataInicio || !horarioInicial || !dataFim || !horarioFinal) {
      Alert.alert("Dados incompletos", "Selecione período e horários.");
      return;
    }

    const inicioSQL = formatarData(
      dataInicio.dateString || dataInicio,
      horarioInicial
    );
    const fimSQL = formatarData(dataFim.dateString || dataFim, horarioFinal);

    if (!inicioSQL || !fimSQL) {
      Alert.alert(
        "Erro de Formatação",
        "Data/hora inválida para a contratação."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("acessToken");
      if (!token) {
        Alert.alert("Autenticação Necessária", "Faça login para prosseguir.");
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
        "Falha ao confirmar. Tente novamente."
      );
      console.error(
        "Erro ao confirmar contratação:",
        erro.response?.data || erro.message || erro
      );
    }
  }

  function redirecionar() {
    try {
      setPopupConfirmacao(false);
      if (navegacao && typeof navegacao.navigate === "function") {
        navegacao.navigate("Pedidos");
      } else {
        Alert.alert(
          "Erro de Navegação",
          "Controlador de navegação indisponível."
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro de Navegação",
        `Não foi possível acessar Pedidos: ${error.message}`
      );
    }
  }

  function formatarPreco(valor) {
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "Preço indisponível";
    return `R$ ${numero.toFixed(2).replace(".", ",")} por diária`;
  }

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.scrollContentContainer}
    >
      <NavBarHome title={"Eletricista"} />
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Serviços de Eletricista</Text>
        <Text style={estilos.subtitulo}>
          Encontre os melhores eletricistas para suas necessidades.
        </Text>

        <FiltroPrestadores
          nota={nota}
          definirNota={definirNota}
          precoMin={precoMin}
          definirPrecoMin={definirPrecoMin}
          precoMax={precoMax}
          definirPrecoMax={definirPrecoMax}
          valorDataFiltroInicio={dataFiltroInicio}
          valorDataFiltroFim={dataFiltroFim}
          mostrarSeletorDataInicio={mostrarSeletorDataInicio}
          definirMostrarSeletorDataInicio={definirMostrarSeletorDataInicio}
          mostrarSeletorDataFim={mostrarSeletorDataFim}
          definirMostrarSeletorDataFim={definirMostrarSeletorDataFim}
          aoMudarDataInicioFiltro={lidarComMudancaDataInicio}
          aoMudarDataFimFiltro={lidarComMudancaDataFim}
          aoAplicarTodosOsFiltros={aoAplicarTodosOsFiltrosHandler}
        />

        <Text style={estilos.subtitulo2}>Nossos Eletricistas</Text>

        {prestadoresFiltrados.length > 0 ? (
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
                  const telefoneLimpo = item.telefone?.replace(/[^\d]/g, "");
                  if (telefoneLimpo) {
                    Linking.openURL(`https://wa.me/55${telefoneLimpo}`);
                  } else {
                    Alert.alert(
                      "Contato Indisponível",
                      "O número de WhatsApp não foi fornecido."
                    );
                  }
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
          <Text style={estilos.textoNenhum}>
            Nenhum eletricista encontrado com os filtros aplicados. Tente outros
            critérios.
          </Text>
        )}
      </View>

      {prestadorSelecionado && (
        <CalendarioContratacao
          visivel={modalCalendarioVisivel}
          fecharModal={() => setModalCalendarioVisivel(false)}
          datasOcupadas={datasOcupadas}
          dataInicio={dataInicio}
          definirDataInicio={setDataInicio}
          dataFim={dataFim}
          definirDataFim={setDataFim}
          mostrarHorarioInicial={mostrarHorarioInicial}
          definirMostrarHorarioInicial={setMostrarHorarioInicial}
          mostrarHorarioFinal={mostrarHorarioFinal}
          definirMostrarHorarioFinal={setMostrarHorarioFinal}
          horarioInicial={horarioInicial}
          definirHorarioInicial={setHorarioInicial}
          horarioFinal={horarioFinal}
          definirHorarioFinal={setHorarioFinal}
          observacoes={observacoes}
          definirObservacoes={setObservacoes}
          confirmarContratacao={confirmarContratacao}
          prestadorSelecionado={prestadorSelecionado}
          popupConfirmacao={popupConfirmacao}
          definirPopupConfirmacao={setPopupConfirmacao}
          redirecionar={redirecionar}
        />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#075985",
  },
  scrollContentContainer: {
    paddingBottom: 30,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#e0f2fe",
    textAlign: "center",
    marginBottom: 25,
  },
  subtitulo2: {
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
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075985",
  },
  cardText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0369a1",
    marginTop: 8,
    marginBottom: 12,
  },
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
    marginLeft: 8,
  },
  botaoContratar: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  textoNenhum: {
    color: "#bae6fd",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  star: {
    fontSize: 18,
    marginRight: 3,
  },
  starFilled: {
    color: "#FBBF24",
  },
  starEmpty: {
    color: "#D1D5DB",
  },
  ratingText: {
    marginLeft: 6,
    color: "#4B5563",
    fontSize: 14,
  },
});
