import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function FiltroPrestadores({
  nota,
  definirNota,
  precoMin,
  definirPrecoMin,
  precoMax,
  definirPrecoMax,
  aoFiltrar,
}) {
  return (
    <View style={estilos.containerFiltro}>
      <TextInput
        style={estilos.inputTexto}
        placeholder="Nota (0-5)"
        value={nota}
        onChangeText={definirNota}
        keyboardType="numeric"
      />
      <TextInput
        style={estilos.inputTexto}
        placeholder="Preço Mínimo"
        value={precoMin}
        onChangeText={definirPrecoMin}
        keyboardType="numeric"
      />
      <TextInput
        style={estilos.inputTexto}
        placeholder="Preço Máximo"
        value={precoMax}
        onChangeText={definirPrecoMax}
        keyboardType="numeric"
      />
      <TouchableOpacity style={estilos.botaoFiltrar} onPress={aoFiltrar}>
        <Text style={estilos.textoBotao}>Filtrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  containerFiltro: {
    marginBottom: 20,
  },
  inputTexto: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  botaoFiltrar: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
  },
});
