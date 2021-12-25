import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

function Settings ({ navigation }) {

    const { signOut } = React.useContext(AuthContext)
        return (
            <View style={styles.container}>
                <Text>Settings Screen!</Text>
                <Button title="SignOut" onPress={() => signOut()} />
            </View>
        )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Settings