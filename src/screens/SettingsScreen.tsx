import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type SettingsScreenProps = {
  onLogout: () => void | Promise<void>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SettingsScreen</Text>
      <Button title="Log Out" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
  },
});

export default SettingsScreen;
