import React, { useEffect, Component, useState } from "react";
import { StyleSheet, Text, View, TextInput, Platform, TouchableOpacity, ScrollView, RefreshControl, Alert, ImageBackground } from "react-native";
import { Feather } from '@expo/vector-icons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import countries from "./countries";
import { UserInterfaceIdiom } from "expo-constants";
import axios from './axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native-paper";
import * as Clipboard from 'expo-clipboard';
import Modal from "react-native-modal";
import { useFonts } from "expo-font";
import TipProvider from "react-native-tip";
import { Tip } from "react-native-tip";
import { Fontisto } from '@expo/vector-icons';

const customFonts = {
    Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Optien: require("../assets/fonts/Optien.ttf"),
    Prompt: require("../assets/fonts/Prompt-ExtraBold.ttf")
};

function PrefferedCurrency({ navigation }) {
    const [id, setID] = useState("")
    const [user, setUser] = useState("")
    const [refreshing, setRefreshing] = useState("")
    const [aCountries, setAcountries] = useState([])
    const [myCountry, setMyCountry] = useState("")
    const [country, setCountry] = useState("")
    const [currency, setCurrency] = useState("")
    const [cleanUp, setCleanUp] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        setID(id)
        navigation.addListener('focus', async () => {
            axios.post('/user', { userID: id })
                .then((data) => {
                    setUser(data.data.response)
                    setRefreshing(false)
                    setAcountries(countries.sort((a, b) => {
                        if (a.countryName < b.countryName) {
                            return -1
                        }
                        if (a.countryName > b.countryName) {
                            return 1
                        }
                        return 0
                    }))
                    console.log({ data: data.data.response })
                    return data.data.response
                })
                .then(user => {
                    
                })
        })

        axios.post('/user', { userID: id })
                .then((data) => {
                    setUser(data.data.response)
                    setRefreshing(false)
                    setAcountries(countries.sort((a, b) => {
                        if (a.countryName < b.countryName) {
                            return -1
                        }
                        if (a.countryName > b.countryName) {
                            return 1
                        }
                        return 0
                    }))
                    console.log({ data: data.data.response })
                    return data.data.response
                })
                .then(user => {
                    
                })
    }, [cleanUp])

    const searchHandler = (val) => {
        setAcountries(countries.filter(it => it.countryName.indexOf(val) !== -1 || it.currencyCode.indexOf(val) !== -1 ))
    }

    const countryHandler = (val) => {
        setMyCountry(val.countryName)
        setCountry(val.countryName)
        setCurrency(val.currencyCode)
        setLoading(true)
        axios.post('/update-currency', { currency: val.currencyCode, userID: id })
            .then(user => {
                if (user.data.response) {
                    setUser(user.data.response)
                    setLoading(false)
                    navigation.navigate("Portfolio")
                }
            })
            .catch(err => {
                console.log
            })
    }

    if (loading) {
        return (
            <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#febf12" />
            </View>
        )
    }

    return (
        <View style={styles.wcont}>
            <TouchableOpacity onPress={() => { navigation.navigate("Portfolio") }} style={styles.cancel}>
                <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
                style={styles.numsSearch}
                placeholder="search"
                onChangeText={(val) => searchHandler(val)}
            // returnKeyType="done"
            />
            <FlatList
                keyExtractor={(item) => item.countryCode + item.currencyCode}
                data={aCountries.filter(count => count.currencyCode !== "")}
                renderItem={({ item }) => (
                    <TouchableOpacity style={item.currencyCode == user.currency ? styles.txTouchSelected : styles.txTouch} onPress={() => countryHandler(item)}>

                        <View>
                            <Text style={styles.txText}>{item.countryName} ( {item.currencyCode} )</Text>
                        </View>

                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wcont: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        paddingHorizontal: 15
    },
    cancel: {
        top: 0,
        marginBottom: 20,
        marginTop: 10
    },
    numsSearch: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 18,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "100%",
        marginBottom: 10,
        height: 60,
        borderWidth: 2,
        borderColor: "#febf12",
    },
    txTouch: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingVertical: 7,
    },
    txTouchSelected: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingVertical: 7,
        backgroundColor: "whitesmoke",
    },
    txText: {
        marginLeft: 5,
        fontWeight: "700",
        marginVertical: 5,
        fontFamily: "Prompt",
        fontSize: 17,
    },
})

export default PrefferedCurrency