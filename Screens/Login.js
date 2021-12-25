import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";


function SignIn({ navigation }) {
    const { signIn } = React.useContext(AuthContext)
    
    return (
        <View style={styles.container}>
            <Text>SignIn Screen!</Text>
            <Button title="Sign Up" onPress={() => navigation.push("SignUp")} />
            <Button title="Log In" onPress={() => signIn()} />
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

export default SignIn