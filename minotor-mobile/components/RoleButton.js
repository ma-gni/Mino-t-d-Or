import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RoleButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
  },
});
