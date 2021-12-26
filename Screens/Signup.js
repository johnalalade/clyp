import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp1 from "./SignUp-1";
import SignUp2 from "./SignUp-2";
import SignUp3 from "./SingUp-3";

const SignInStack = createStackNavigator()

function SignUp({ navigation }) {
    const { signUp } = React.useContext(AuthContext)
        return (
            // <View style={styles.container}>
            //     <Text>CLYP</Text>
            //     <Text>Sign Up on Clyp</Text>
            //     <Button title="Sign up" onPress={() => signUp()} />
            //     <Button title="Sign In" onPress={() => navigation.goBack()} />
            // </View>
            <NavigationContainer independent={true}>
              <SignInStack.Navigator>
                <SignInStack.Screen name="sign-1" component={SignUp1} options={{ headerShown: false }} />

                <SignInStack.Screen name="sign-2" component={SignUp2} options={{ headerShown: false }} />

                <SignInStack.Screen name="sign-3" component={SignUp3} options={{ headerShown: false }} />

              </SignInStack.Navigator>
            </NavigationContainer>
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