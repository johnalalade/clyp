import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

function SignUp1({ navigation }) {
    const { name, username, ref } = React.useContext(AuthContext)

    return (
        <View style={styles.container}>

            <View >
                <StatusBar backgroundColor='#FF6347' barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Let's make you a Clyper</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <ScrollView>
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]} >Full name *</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Full Name"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => name(val)}
                            />
                            {/* {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null} */}
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Username *</Text>
                        <View style={styles.action}>
                            <Ionicons name="at-circle-sharp" size={20} color="#05375a" />
                            <TextInput
                                placeholder="Your Username"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => username(val)}
                            />
                            {/* {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null} */}
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Referral Clyp ID (optional)</Text>
                        <View style={styles.action}>
                            <FontAwesome5 name="people-arrows" size={20} color="#05375a" />
                            <TextInput
                                placeholder="Your Username"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => ref(val)}
                            />

                        </View>

                        <View style={styles.button}>
                            {/* <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={[styles.signIn, {
                                    borderColor: '#FF6347',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#FF6347'
                                }]}>Previous</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                onPress={() => navigation.push("sign-2")}
                                style={[styles.signIn, {
                                    borderColor: 'whitesmoke',
                                    backgroundColor: "#febf12",
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: 'white'
                                }]}>Next</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.textPrivate}>
                            <Text style={styles.color_textPrivate}>
                                {/* By signing up you agree to our */}
                            </Text>
                            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>

                            </Text>
                            <Text style={styles.color_textPrivate}>
                                {/* {" "}and */}
                            </Text>
                            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>
                                {/* {" "}Privacy policy */}
                            </Text>
                        </View>

                    </ScrollView>
                </Animatable.View>
            </View>
            {/* <Button title="Next" onPress={() => navigation.push("sign-2")} /> */}
            {/* <Button title="Log In" onPress={() => signIn()} /> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column",
        paddingBottom: 90,
        paddingTop: 30
    },
    header: {
        flex: 0.5,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10
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
        marginTop: 0
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

export default SignUp1