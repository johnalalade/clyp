import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, StatusBar, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

function SignIn({ navigation }) {
    const { email, password, signIn } = React.useContext(AuthContext)

    const [secE, setSecE] = React.useState(true)

    const sec = () => setSecE(!secE)

    const { colors } = useTheme();

    return (
        <View style={styles.container}>
           
            <View style={styles.container}>
                <StatusBar backgroundColor='#FF6347' barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Welcome, Sign in!</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <ScrollView>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Email</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="email@email.com"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => email(val)}
                            />

                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Confirm Your Password"
                                secureTextEntry={secE}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => password(val)}
                            />
                            <TouchableOpacity
                                onPress={sec}
                            >
                                {secE ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textPrivate}>
                            <Text style={styles.color_textPrivate}>
                                You don't have an account ?
                            </Text>
                            {/* <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                            <Text style={styles.color_textPrivate}>{" "}and</Text> */}
                            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]} onPress={() => navigation.push("SignUp")}>{" "}Sign up</Text>
                        </View>
                        <View style={styles.button}>

                            <TouchableOpacity
                                onPress={() => signIn()}
                                style={[styles.signIn, {
                                    borderColor: '#FF6347',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#FF6347'
                                }]}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animatable.View>
            </View>

            {/* <Button title="Sign Up" onPress={() => navigation.push("SignUp")} />
            <Button title="Log In" onPress={() => signIn()} /> */}
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
    header: {
        flex: 0.5,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 50
    },
    signIn: {
        width: '40%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey',
        width: "100%"
    }

});

export default SignIn