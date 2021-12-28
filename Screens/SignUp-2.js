import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { FlatList } from "react-native-gesture-handler";

function SignUp2({ navigation }) {
    const { email, phone, country } = React.useContext(AuthContext)
    const [myCountry, setMyCountry] = React.useState("Nigeria")
    const [countries, setCountries] = React.useState([
        { name: 'Nigeria', code: 'NG' },
        { name: 'Ghana', code: 'GH' },
        { name: 'Kenya', code: 'KE' },
        { name: 'Uganda', code: 'UG' },
        { name: 'Tanzania, United Republic of', code: 'TZ' },
        { name: 'South Africa', code: 'ZA' },
        { name: 'Cote D\'Ivoire', code: 'CI' },
    ])

    const countryHandler = (val) => {
        setMyCountry(val)
        country(val)
        bs.current.snapTo(2)
    }

    const renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Your Country</Text>
                <Text style={styles.panelSubtitle}>Availabe Countries</Text>
            </View>
            <ScrollView>
                {countries.map(item => (
                    <TouchableOpacity key={item.code} style={(myCountry === item.name) ? styles.countryText : styles.countryTextSelected} onPress={() => countryHandler(item.name)}><Text>{item.name}</Text></TouchableOpacity>
                ))}
            </ScrollView>
            {/* <FlatList 
            keyExtractor={(item) => item.code}
            data={countries}
            renderItem={( { item } ) => (
                <TouchableOpacity style={(myCountry === item.name) ? styles.countryText : styles.countryTextSelected } onPress={) => countryHandler(item.name)}><Text>{item.name}</Text></TouchableOpacity>
            )}
            /> */}
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(2)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    let bs = React.createRef();
    let fall = new Animated.Value(1);


    return (
        <View style={styles.container}>
            <BottomSheet
                ref={bs}
                snapPoints={[400, 330, 0]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={2}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />

            <View style={styles.container}>
                <StatusBar backgroundColor='#FF6347' barStyle="light-content" />

                <View style={styles.header}>
                    <Text style={styles.text_header}>Almost there!</Text>
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
                                placeholder="email@eamil.com"
                                style={styles.textInput}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={(val) => email(val)}
                            />
                            {/* {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="yellow"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null} */}
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Phone</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="+XXXXX"
                                style={styles.textInput}
                                autoCapitalize="none"
                                keyboardType="phone-pad"
                                onChangeText={(val) => phone(val)}
                            />
                            {/* {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="yellow"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null} */}
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]} >Country</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#05375a"
                                size={20}
                            />
                            <TouchableOpacity
                                style={styles.textInput}
                                onPress={() => bs.current.snapTo(1)}
                            >
                                <Text>
                                    {myCountry}
                                </Text>

                            </TouchableOpacity>

                            {/* {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="yellow"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null} */}
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

                        <View style={styles.button}>
                            <TouchableOpacity
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
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.push("sign-3")}
                                style={[styles.signIn, {
                                    borderColor: '#FF6347',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#FF6347'
                                }]}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animatable.View>
            </View>

            {/* <Button title="Previous" onPress={() => navigation.goBack()} /> */}
            {/* <Button title="Next" onPress={() => navigation.push("sign-3")} /> */}
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
        flex: 1,
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
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    countryText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black"
    },
    countryTextSelected: {
        fontSize: 15,
        fontWeight: "bold",
        color: "yellow"
    }
});

export default SignUp2