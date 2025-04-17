import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import FiltroPrestadores from "../FiltroPrestadores";
import CalendarioContratacao from "../CalendarioContratacao";

export default function Encanador() {
  const [nota, setNota] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  const [prestadores, setPrestadores] = useState([]);
  const [prestadoresFiltrados, setPrestadoresFiltrados] = useState([]);

  const [prestadorSelecionado, setPrestadorSelecionado] = useState(null);
  const [datasOcupadas, setDatasOcupadas] = useState({});

 
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  
  const [mostrarHorarioInicial, setMostrarHorarioInicial] = useState(false);
  const [mostrarHorarioFinal, setMostrarHorarioFinal] = useState(false);
  const [horarioInicial, setHorarioInicial] = useState(null);
  const [horarioFinal, setHorarioFinal] = useState(null);

  const [observacoes, setObservacoes] = useState("");

  const [modalCalendarioVisivel, setModalCalendarioVisivel] = useState(false);
  const [popupConfirmacao, setPopupConfirmacao] = useState(false);

  const navegacao = useNavigation();

  async function buscarPrestadores() {
    try {
      const resposta = await api.get("/encanador");
      setPrestadores(resposta.data);
      setPrestadoresFiltrados(resposta.data);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar prestadores.");
    }
  }

  useEffect(() => {
    buscarPrestadores();
  }, []);

  function filtrar() {
    const filtrados = prestadores.filter((p) => {
      let valido = true;
      if (nota) valido = valido && parseInt(p.nota, 10) === parseInt(nota, 10);
      if (precoMin) valido = valido && p.preco >= parseFloat(precoMin);
      if (precoMax) valido = valido && p.preco <= parseFloat(precoMax);
      return valido;
    });
    setPrestadoresFiltrados(filtrados);
  }

  async function verAgenda(item) {
    setPrestadorSelecionado(item);
    setDataInicio(null);
    setDataFim(null);
    setHorarioInicial(null);
    setHorarioFinal(null);
    setObservacoes("");

    try {
      const { data } = await api.get(`/prestadores/${item.id}/schedule`);
      const marcacoes = {};
      data.forEach((evento) => {
        const inicio = new Date(evento.data_inicio);
        const fim = new Date(evento.data_fim);
        const atual = new Date(inicio);
        while (atual <= fim) {
          const chave = atual.toISOString().slice(0, 10);
          marcacoes[chave] = {
            disabled: true,
            marked: true,
            dotColor: "red",
            disableTouchEvent: true,
          };
          atual.setDate(atual.getDate() + 1);
        }
      });
      setDatasOcupadas(marcacoes);
      setModalCalendarioVisivel(true);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar a agenda.");
    }
  }

  function formatarData(diaISO, hora) {
    if (!diaISO || !hora) return null;
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

    const inicioSQL = formatarData(dataInicio, horarioInicial);
    const fimSQL = formatarData(dataFim, horarioFinal);

    if (!inicioSQL || !fimSQL) {
      Alert.alert("Erro", "Não foi possível formatar data/hora.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("acessToken");
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
    } catch {
      Alert.alert("Erro", "Falha ao confirmar contratação.");
    }
  }

  function redirecionar() {
    setPopupConfirmacao(false);
    navegacao.navigate("Pedidos");
  }

  function valorFormatado(v) {
    return `R$ ${parseFloat(v).toFixed(2)} por diária`;
  }

  return (
    <ScrollView style={estilos.container}>
      <View style={[estilos.navBar, { paddingTop: 40 }]}>
        <Text style={estilos.navText}>Home</Text>
      </View>

      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Serviços de Encanador</Text>
        <Text style={estilos.subtitulo}>
          Oferecemos serviços de encanador de alta qualidade.
        </Text>

        <FiltroPrestadores
          nota={nota}
          definirNota={setNota}
          precoMin={precoMin}
          definirPrecoMin={setPrecoMin}
          precoMax={precoMax}
          definirPrecoMax={setPrecoMax}
          aoFiltrar={filtrar}
        />

        <Text style={estilos.subtitulo2}>Nossos Encanadores</Text>

        {prestadoresFiltrados.length ? (
          prestadoresFiltrados.map((p) => (
            <View key={p.id} style={estilos.card}>
              <View style={estilos.cardHeader}>
                <Text style={estilos.cardTitle}>{p.nome}</Text>
              </View>
              <Text style={estilos.cardText}>{p.titulo}</Text>
              <Text style={estilos.cardText}>{p.descricao}</Text>
              <Text style={estilos.cardPrice}>{valorFormatado(p.preco)}</Text>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/55${p.telefone?.replace(/[^\d]/g, "")}`
                  )
                }
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "#22c55e" }}>Contato via WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.botaoContratar}
                onPress={() => verAgenda(p)}
              >
                <Text style={estilos.textoBotao}>Ver Agenda</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={estilos.textoNenhum}>
            Nenhum encanador disponível no momento.
          </Text>
        )}
      </View>

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
        redirecionar={redirecionar}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#075985" },
  navBar: { padding: 10, backgroundColor: "#0284c7" },
  navText: { color: "#fff", fontSize: 18 },
  conteudo: { padding: 20 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitulo2: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
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
  cardText: { color: "#4b5563", marginTop: 3 },
  cardPrice: { fontWeight: "600", color: "#0284c7", marginTop: 5 },
  botaoContratar: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "600" },
  textoNenhum: { color: "#fff", textAlign: "center" },
});
