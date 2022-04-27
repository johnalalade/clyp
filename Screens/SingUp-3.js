import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native-paper";
import TipProvider from "react-native-tip";
import { Tip } from "react-native-tip";
import HyperLink from "react-native-hyperlink";

function SignUp3({ navigation }) {
    const { signUp, password, cpassword, bvn, count, load } = React.useContext(AuthContext)
    const [secE, setSecE] = React.useState(true)
    const [isNainja, setIsNainja] = React.useState(AsyncStorage.getItem('country').then(value => value))
    const [loading, setLoading] = React.useState(load)

    const sec = () => setSecE(!secE)

    if (load) {
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
                    <Text style={styles.text_header}>Finish up!</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <ScrollView>

                        {(count === "Nigeria") ? <View>
                            <Text style={[styles.text_footer, {
                                marginTop: 35
                            }]}>BVN
                                <Tip title="Why BVN?" body="We use your BVN to create a virtual account number for you. We will never save your BVN on our Database." >
                                    <FontAwesome style={{ marginLeft: 4 }} name="question-circle" size={20} color="grey" />
                                </Tip>
                            </Text>
                            <View style={styles.action}>
                                <FontAwesome name="bank" size={20} color="#05375a" />
                                <TextInput
                                    placeholder="Bank Verification Number"
                                    // secureTextEntry={secE}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => bvn(val)}
                                />
                                {/* <TouchableOpacity
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
                                </TouchableOpacity> */}
                            </View>
                        </View>
                            : null}

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Password *</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Password"
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

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Confirm Password *</Text>
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
                                onChangeText={(val) => cpassword(val)}
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
                                By signing up you agree to our
                            </Text>

                            <HyperLink linkDefault={true} linkStyle={{ backgroundColor: null }} linkText="Terms of service">
                                <Text style={[styles.color_textPrivate, { fontWeight: 'bold', paddingLeft: 4 }]}>https://www.clypapp.com/terms.html</Text>
                            </HyperLink>

                            <Text style={styles.color_textPrivate}>and</Text>

                            <HyperLink linkDefault={true} linkStyle={{ backgroundColor: null }} linkText="Privacy Policy" >
                                <Text style={[styles.color_textPrivate, { fontWeight: 'bold', paddingLeft: 3 }]}>https://www.clypapp.com/privacy.html</Text>
                            </HyperLink>
                        </View>
                        <View style={styles.button}>

                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={[styles.signIn, {
                                    borderColor: '#febf12',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#febf12'
                                }]}>Previous</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { signUp(); setLoading(true); setTimeout(() => { setLoading(false) }, 3000) }}
                                style={[styles.signIn, {
                                    borderColor: 'whitesmoke',
                                    backgroundColor: '#febf12',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: "white"
                                }]}>Finish</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animatable.View>
            </View>
            <TipProvider />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10
    },
    header: {
        flex: 0.32,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30
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
        color: 'grey'
    }
});

export default SignUp3