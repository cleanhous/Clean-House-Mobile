import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import FiltroPrestadores from "../FiltroPrestadores";
import CalendarioContratacao from "../CalendarioContratacao";

export default function Eletricista() {
  const [nota, definirNota] = useState("");
  const [precoMin, definirPrecoMin] = useState("");
  const [precoMax, definirPrecoMax] = useState("");
  const [prestadores, definirPrestadores] = useState([]);
  const [prestadoresFiltrados, definirPrestadoresFiltrados] = useState([]);
  const [prestadorSelecionado, definirPrestadorSelecionado] = useState(null);
  const [datasOcupadas, definirDatasOcupadas] = useState({});
  const [diaSelecionado, definirDiaSelecionado] = useState(null);
  const [mostrarHorarioInicial, definirMostrarHorarioInicial] = useState(false);
  const [mostrarHorarioFinal, definirMostrarHorarioFinal] = useState(false);
  const [horarioInicial, definirHorarioInicial] = useState(null);
  const [horarioFinal, definirHorarioFinal] = useState(null);
  const [observacoes, definirObservacoes] = useState("");
  const [modalCalendarioVisivel, definirModalCalendarioVisivel] = useState(false);
  const [popupConfirmacao, definirPopupConfirmacao] = useState(false);
  const navegacao = useNavigation();

  async function buscarPrestadores() {
    try {
      const resposta = await api.get("/eletricista");
      definirPrestadores(resposta.data);
      definirPrestadoresFiltrados(resposta.data);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível buscar prestadores.");
    }
  }

  useEffect(() => {
    buscarPrestadores();
  }, []);

  function aoFiltrar() {
    const filtrados = prestadores.filter((item) => {
      let valido = true;
      if (nota) {
        valido = valido && parseInt(item.nota, 10) === parseInt(nota, 10);
      }
      if (precoMin) {
        valido = valido && item.preco >= parseFloat(precoMin);
      }
      if (precoMax) {
        valido = valido && item.preco <= parseFloat(precoMax);
      }
      return valido;
    });
    definirPrestadoresFiltrados(filtrados);
  }

  async function verAgenda(item) {
    definirPrestadorSelecionado(item);
    definirDiaSelecionado(null);
    definirHorarioInicial(null);
    definirHorarioFinal(null);
    definirObservacoes("");
    try {
      const resposta = await api.get(`/prestadores/${item.id}/schedule`);
      const agendamento = resposta.data;
      const marcacoes = {};
      agendamento.forEach((evento) => {
        const inicio = new Date(evento.data_inicio);
        const fim = new Date(evento.data_fim);
        const atual = new Date(inicio);
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
      });
      definirDatasOcupadas(marcacoes);
      definirModalCalendarioVisivel(true);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível carregar a agenda.");
    }
  }

  function formatarData(dayString, dataHora) {
    if (!dayString || !dataHora) return null;
    const [ano, mes, dia] = dayString.split("-");
    const hora = String(dataHora.getHours()).padStart(2, "0");
    const minuto = String(dataHora.getMinutes()).padStart(2, "0");
    return `${ano}-${mes}-${dia} ${hora}:${minuto}:00`;
  }

  async function confirmarContratacao() {
    if (!diaSelecionado || !horarioInicial || !horarioFinal) {
      Alert.alert("Dados incompletos", "Selecione dia e horários.");
      return;
    }
    const dataInicio = formatarData(diaSelecionado, horarioInicial);
    const dataFim = formatarData(diaSelecionado, horarioFinal);
    if (!dataInicio || !dataFim) {
      Alert.alert("Erro", "Não foi possível formatar a data/hora.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("acessToken");
      await api.post(
        "/contrato",
        {
          prestadorId: prestadorSelecionado.id,
          dataInicio,
          dataFim,
          observacao: observacoes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      definirModalCalendarioVisivel(false);
      definirPopupConfirmacao(true);
    } catch (erro) {
      Alert.alert("Erro", "Falha ao confirmar contratação.");
    }
  }

  function redirecionar() {
    definirPopupConfirmacao(false);
    navegacao.navigate("Pedidos");
  }

  function formatarPreco(valor) {
    return `R$ ${parseFloat(valor).toFixed(2)} por diária`;
  }

  return (
    <ScrollView style={estilos.container}>
      <View style={[estilos.navBar, { paddingTop: 40 }]}>
        <Text style={estilos.navText}>Home</Text>
      </View>
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Serviços de Eletricista</Text>
        <Text style={estilos.subtitulo}>
          Oferecemos serviços de eletricista de alta qualidade.
        </Text>
        <FiltroPrestadores
          nota={nota}
          definirNota={definirNota}
          precoMin={precoMin}
          definirPrecoMin={definirPrecoMin}
          precoMax={precoMax}
          definirPrecoMax={definirPrecoMax}
          aoFiltrar={aoFiltrar}
        />
        <Text style={estilos.subtitulo2}>Nossos Eletricistas</Text>
        {prestadoresFiltrados.length > 0 ? (
          prestadoresFiltrados.map((item) => (
            <View key={item.id} style={estilos.card}>
              <View style={estilos.cardHeader}>
                <Text style={estilos.cardTitle}>{item.nome}</Text>
              </View>
              <Text style={estilos.cardText}>{item.titulo}</Text>
              <Text style={estilos.cardText}>{item.descricao}</Text>
              <Text style={estilos.cardPrice}>{formatarPreco(item.preco)}</Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/55${item.telefone?.replace(/[^\d]/g, "")}`
                  )
                }
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "#22c55e" }}>Contato via WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.botaoContratar}
                onPress={() => verAgenda(item)}
              >
                <Text style={estilos.textoBotao}>Ver Agenda</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={estilos.textoNenhum}>
            Nenhum eletricista disponível no momento.
          </Text>
        )}
      </View>
      <CalendarioContratacao
        visivel={modalCalendarioVisivel}
        fecharModal={() => definirModalCalendarioVisivel(false)}
        datasOcupadas={datasOcupadas}
        diaSelecionado={diaSelecionado}
        definirDiaSelecionado={definirDiaSelecionado}
        mostrarHorarioInicial={mostrarHorarioInicial}
        definirMostrarHorarioInicial={definirMostrarHorarioInicial}
        mostrarHorarioFinal={mostrarHorarioFinal}
        definirMostrarHorarioFinal={definirMostrarHorarioFinal}
        horarioInicial={horarioInicial}
        definirHorarioInicial={definirHorarioInicial}
        horarioFinal={horarioFinal}
        definirHorarioFinal={definirHorarioFinal}
        observacoes={observacoes}
        definirObservacoes={definirObservacoes}
        confirmarContratacao={confirmarContratacao}
        prestadorSelecionado={prestadorSelecionado}
        popupConfirmacao={popupConfirmacao}
        redirecionar={redirecionar}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#075985",
  },
  navBar: {
    padding: 10,
    backgroundColor: "#0284c7",
  },
  navText: {
    color: "#fff",
    fontSize: 18,
  },
  conteudo: {
    padding: 20,
  },
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#075985",
  },
  cardText: {
    color: "#4b5563",
    marginTop: 3,
  },
  cardPrice: {
    fontWeight: "600",
    color: "#0284c7",
    marginTop: 5,
  },
  botaoContratar: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
  },
  textoNenhum: {
    color: "#fff",
    textAlign: "center",
  },
});
