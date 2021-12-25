import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

function SignUp({ navigation }) {
    const { signUp } = React.useContext(AuthContext)
        return (
            <View style={styles.container}>
                <Text>SignUp Screen!</Text>
                <Button title="Sign up" onPress={() => signUp()} />
                <Button title="Sign In" onPress={() => navigation.goBack()} />
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

export default SignUp