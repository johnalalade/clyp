import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, StatusBar, TouchableOpacity, ScrollView, Alert } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import axios from "./axios";
import * as Animatable from 'react-native-animatable';

function Password({ navigation }) {
    const [mail, setMail] = React.useState()
    const [loading, setLoading] = React.useState(false)

    const submit = () => {
        axios.post('/retrive', {email: mail})
        .then(data => {
            setLoading(false)
            Alert.alert("Message", `${data.data.message}`, [
                (data.data.message !== "User Doesn't Exist.") ? {
                    text: 'Sign in', onPress: () => {
                        navigation.push("SignIn")
                    }
                } : {
                    text: 'Sign up', onPress: () => {
                        navigation.push("SignUp")
                    }
                }
            ])
        })
    }

    const email = (val) => {
        setMail(val)
    }

    const { colors } = useTheme();
    if (loading) {
        return (
            <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#febf12" />
            </View>
        )
    }


    return (
        <View style={styles.container}>

            <View style={styles.container}>
                <StatusBar backgroundColor='#FF6347' barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Let's get you back!</Text>
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
                                defaultValue={mail}
                            />

                        </View>


                        <View style={styles.textPrivate}>
                            <Text style={styles.color_textPrivate}>
                                You don't have an account ?
                            </Text>
            
                            <Text style={[styles.color_textPrivate, { fontWeight: 'bold', color: "#febf12" }]} onPress={() => navigation.push("SignUp")}>{" "}Sign up</Text>
                            
                        </View>
                        <View style={styles.button}>

                            <TouchableOpacity
                                onPress={() => { submit(); setLoading(true)}}
                                style={[styles.signIn, {
                                    backgroundColor: "#febf12",
                                    borderColor: 'whitesmoke',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: 'white'
                                }]}>Retrive</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </Animatable.View>
            </View>

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

export default Password