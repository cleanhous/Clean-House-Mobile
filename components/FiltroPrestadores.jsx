import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MoveDown, MoveUp } from "lucide-react-native";

const formatarDataParaAPI = (data) => {
  if (!data) return null;
  if (!(data instanceof Date)) {
      console.warn("formatarDataParaAPI recebeu algo que não é um objeto Date:", data);
      return "Data inválida";
  }
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export default function FiltroPrestadores({
  nota,
  definirNota,
  precoMin,
  definirPrecoMin,
  precoMax,
  definirPrecoMax,
  valorDataFiltroInicio,
  valorDataFiltroFim,
  mostrarSeletorDataInicio,
  definirMostrarSeletorDataInicio,
  mostrarSeletorDataFim,
  definirMostrarSeletorDataFim,
  aoMudarDataInicioFiltro,
  aoMudarDataFimFiltro,
  aoAplicarTodosOsFiltros,
}) {
  const [filtrosVisiveisInterno, definirFiltrosVisiveisInterno] = useState(false);

  return (
    <View style={estilos.filtroContainerPrincipal}>
      <TouchableOpacity
        style={estilos.filtroHeader}
        onPress={() => definirFiltrosVisiveisInterno(!filtrosVisiveisInterno)}
        activeOpacity={0.7}
      >
        <Text style={estilos.filtroHeaderText}>
          {filtrosVisiveisInterno ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Text>
        {filtrosVisiveisInterno ? <MoveDown  size={20}/> : <MoveUp  size={20} />}
        
      </TouchableOpacity>

      {filtrosVisiveisInterno && (
        <View style={estilos.filtroConteudo}>
          <Text style={estilos.labelFiltro}>Disponível de:</Text>
          <TouchableOpacity
            onPress={() => definirMostrarSeletorDataInicio(true)}
            style={estilos.inputData}
          >
            <Text style={valorDataFiltroInicio ? estilos.textoDataSelecionada : estilos.textoPlaceholderData}>
              {valorDataFiltroInicio ? formatarDataParaAPI(valorDataFiltroInicio) : "Selecione a data inicial"}
            </Text>
          </TouchableOpacity>
          {mostrarSeletorDataInicio && ( 
            <DateTimePicker
              value={valorDataFiltroInicio || new Date()} 
              mode="date"
              display="default"
              onChange={aoMudarDataInicioFiltro} 
              minimumDate={new Date()}
            />
          )}

          <Text style={estilos.labelFiltro}>Disponível até:</Text>
          <TouchableOpacity
            onPress={() => definirMostrarSeletorDataFim(true)} 
            style={estilos.inputData}
          >
            <Text style={valorDataFiltroFim ? estilos.textoDataSelecionada : estilos.textoPlaceholderData}>
              {valorDataFiltroFim ? formatarDataParaAPI(valorDataFiltroFim) : "Selecione a data final"}
            </Text>
          </TouchableOpacity>
          {mostrarSeletorDataFim && ( 
            <DateTimePicker
              value={valorDataFiltroFim || valorDataFiltroInicio || new Date()} 
              mode="date"
              display="default"
              onChange={aoMudarDataFimFiltro} 
              minimumDate={valorDataFiltroInicio || new Date()}
            />
          )}

          <Text style={estilos.labelFiltro}>Nota (0-5):</Text>
          <TextInput
            style={estilos.inputTexto}
            placeholder="Ex: 4"
            value={nota}
            onChangeText={definirNota}
            keyboardType="numeric"
            maxLength={1}
          />

          <Text style={estilos.labelFiltro}>Preço Mínimo (R$):</Text>
          <TextInput
            style={estilos.inputTexto}
            placeholder="Ex: 50"
            value={precoMin}
            onChangeText={definirPrecoMin}
            keyboardType="numeric"
          />

          <Text style={estilos.labelFiltro}>Preço Máximo (R$):</Text>
          <TextInput
            style={estilos.inputTexto}
            placeholder="Ex: 200"
            value={precoMax}
            onChangeText={definirPrecoMax}
            keyboardType="numeric"
          />

          <TouchableOpacity style={estilos.botaoAplicarFiltros} onPress={() => {
            aoAplicarTodosOsFiltros();
            definirFiltrosVisiveisInterno(false);
          }}>
            <Text style={estilos.textoBotaoPrincipal}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  filtroContainerPrincipal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  filtroHeader: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  filtroHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0c4a6e",
  },
  filtroConteudo: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0f2fe',
  },
  labelFiltro: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
  },
  inputData: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textoDataSelecionada: {
    fontSize: 15,
    color: '#0f172a',
  },
  textoPlaceholderData: {
    fontSize: 15,
    color: '#64748b',
  },
  inputTexto: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  botaoAplicarFiltros: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  textoBotaoPrincipal: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});