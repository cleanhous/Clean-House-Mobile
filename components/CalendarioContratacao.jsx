import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";

export default function CalendarioContratacao({
  visivel,
  fecharModal,
  datasOcupadas,
  dataInicio,
  definirDataInicio,
  dataFim,
  definirDataFim,
  mostrarHorarioInicial,
  definirMostrarHorarioInicial,
  mostrarHorarioFinal,
  definirMostrarHorarioFinal,
  horarioInicial,
  definirHorarioInicial,
  horarioFinal,
  definirHorarioFinal,
  observacoes,
  definirObservacoes,
  confirmarContratacao,
  prestadorSelecionado,
  popupConfirmacao,
  redirecionar,
}) {
  function aoPressionarDia(dia) {
    const data = dia.dateString;
    if (datasOcupadas[data]?.disabled) {
      Alert.alert("Data indisponível", "Este dia já está ocupado.");
      return;
    }
    if (!dataInicio || (dataInicio && dataFim)) {
      definirDataInicio(data);
      definirDataFim(null);
      return;
    }
    if (new Date(data) < new Date(dataInicio)) {
      definirDataInicio(data);
      return;
    }
    definirDataFim(data);
  }

  function aoMudarHorarioInicial(_, data) {
    definirMostrarHorarioInicial(false);
    if (data) definirHorarioInicial(data);
  }

  function aoMudarHorarioFinal(_, data) {
    definirMostrarHorarioFinal(false);
    if (data) definirHorarioFinal(data);
  }

  const periodosMarcados = {};
  if (dataInicio) {
    periodosMarcados[dataInicio] = { startingDay: true, color: "#0284c7", textColor: "#fff" };
    const fim = dataFim || dataInicio;
    let atual = new Date(dataInicio);
    while (atual <= new Date(fim)) {
      const chave = atual.toISOString().slice(0, 10);
      periodosMarcados[chave] = { color: "#7dd3fc", textColor: "#000" };
      atual.setDate(atual.getDate() + 1);
    }
    periodosMarcados[fim] = { ...periodosMarcados[fim], endingDay: true, color: "#0284c7", textColor: "#fff" };
  }

  const habilitaHorarioFinal =
    horarioInicial && ((dataFim && dataFim !== dataInicio) || !dataFim);

  return (
    <>
      <Modal visible={visivel} transparent animationType="slide">
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitle}>
              Agenda de {prestadorSelecionado?.nome}
            </Text>
            <Calendar
              onDayPress={aoPressionarDia}
              markedDates={{ ...datasOcupadas, ...periodosMarcados }}
              markingType="period"
              theme={{ arrowColor: "#0284c7", todayTextColor: "#0284c7" }}
              style={{ marginBottom: 10 }}
            />
            {dataInicio && (
              <>
                <Text style={{ marginVertical: 5 }}>
                  Período: {dataInicio}
                  {dataFim && ` até ${dataFim}`}
                </Text>
                <TouchableOpacity
                  style={estilos.botaoData}
                  onPress={() => definirMostrarHorarioInicial(true)}
                >
                  <Text>
                    {horarioInicial
                      ? `Início: ${horarioInicial.toLocaleTimeString("pt-BR")}`
                      : "Selecionar horário inicial"}
                  </Text>
                </TouchableOpacity>
                {mostrarHorarioInicial && (
                  <DateTimePicker
                    value={horarioInicial || new Date()}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={aoMudarHorarioInicial}
                    {...(Platform.OS === "ios" ? { textColor: "#999" } : {})}
                  />
                )}
                <TouchableOpacity
                  style={[
                    estilos.botaoData,
                    !habilitaHorarioFinal && { opacity: 0.6 },
                  ]}
                  onPress={() => definirMostrarHorarioFinal(true)}
                  disabled={!habilitaHorarioFinal}
                >
                  <Text>
                    {horarioFinal
                      ? `Término: ${horarioFinal.toLocaleTimeString("pt-BR")}`
                      : "Selecionar horário final"}
                  </Text>
                </TouchableOpacity>
                {mostrarHorarioFinal && (
                  <DateTimePicker
                    value={horarioFinal || horarioInicial || new Date()}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={aoMudarHorarioFinal}
                    {...(Platform.OS === "ios" ? { textColor: "#999" } : {})}
                  />
                )}
                <TextInput
                  style={estilos.textArea}
                  placeholder="Observações (opcional)"
                  multiline
                  value={observacoes}
                  onChangeText={definirObservacoes}
                />
                <View style={estilos.modalButtons}>
                  <TouchableOpacity
                    style={estilos.botaoCancelar}
                    onPress={fecharModal}
                  >
                    <Text>Fechar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      estilos.botaoConfirmar,
                      (!horarioInicial || !habilitaHorarioFinal || !horarioFinal) && {
                        backgroundColor: "#999",
                      },
                    ]}
                    onPress={confirmarContratacao}
                    disabled={!horarioInicial || !habilitaHorarioFinal || !horarioFinal}
                  >
                    <Text style={estilos.textoBotao}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {!dataInicio && (
              <View style={estilos.modalButtons}>
                <TouchableOpacity
                  style={estilos.botaoCancelar}
                  onPress={fecharModal}
                >
                  <Text>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={popupConfirmacao} transparent animationType="slide">
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitle}>Contratação confirmada!</Text>
            <Text>
              A contratação de {prestadorSelecionado?.nome} foi realizada com
              sucesso!
            </Text>
            <TouchableOpacity
              style={[estilos.botaoConfirmar, { marginTop: 10 }]}
              onPress={redirecionar}
            >
              <Text style={estilos.textoBotao}>Ver solicitações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
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
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075985",
    marginBottom: 10,
  },
  botaoData: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 60,
    marginTop: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  botaoCancelar: {
    padding: 10,
    backgroundColor: "#d1d5db",
    borderRadius: 5,
    marginRight: 10,
  },
  botaoConfirmar: {
    padding: 10,
    backgroundColor: "#0284c7",
    borderRadius: 5,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
  },
});
