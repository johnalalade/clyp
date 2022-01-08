import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Alert, Modal } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import axios from "./axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Airtime({ navigation }) {
    const [airAmount, setAirAmount] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [user, setUser] = React.useState()
    const [country, setCountry] = React.useState()
    const [style, setStyle] = React.useState(styles.nums)
    const [verified, setVerified] = React.useState(false)
    const [asset, setAsset] = React.useState("FIAT")
    const [address, setAddress] = React.useState("")
    const [pKey, setPkey] = React.useState("")
    const [btc, setBTC] = React.useState()
    const [bnb, setBNB] = React.useState()
    const [eth, setETH] = React.useState()
    const [modalOpen, setModalOpen] = React.useState(true)

    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
                console.log({ data: data.data.response })
                return data.data.response
            })
            .then(user => {
                axios.post('/cryptobalance2', { asset: "BTC", address: user.wallets[0].address })
                    .then((data) => {
                        setBTC(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "BNB", address: user.wallets[1].address })
                    .then((data) => {
                        setBNB(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BNB balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "ETH", address: user.wallets[2].address })
                    .then((data) => {
                        setETH(data.data.balance)
                        // setRefreshing(false)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get ETH balance " + err })
                    })
            })
            .catch(err => {
                console.log({ Err: err })
            })

    }, [])

    const airAmountHandler = (val) => {
        setAirAmount(Number(val))
        if (val < 100 && phone.length === 0) {
            setStyle(styles.error)
            setVerified(false)
        }
        else {
            setStyle(styles.nums)
            setVerified(true)
        }
        if (asset === "Fiat" && phone.length === 0) {
            if (val > user.balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BTC" && phone.length === 0) {
            let balance = btc * user.rate

            if (val >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BNB" && phone.length === 0) {
            let balance = bnb * user.rate


            if (val >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "ETH" && phone.length === 0) {
            let balance = eth * user.rate

            if (val >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else {
            setVerified(true)
            setStyle(styles.nums)
        }
    }
    const airphoneHandler = (val) => {
        setPhone(val)
        if (val.length === 0 && airAmount < 100) {
            setStyle(styles.error)
            setVerified(false)
        }
        else if (asset === "Fiat" && phone.length === 0) {
            if (airAmount > user.balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BTC" && phone.length === 0) {
            let balance = btc * user.rate

            if (airAmount >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BNB" && phone.length === 0) {
            let balance = bnb * user.rate


            if (airAmount >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "ETH" && phone.length === 0) {
            let balance = eth * user.rate

            if (airAmount >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else {
            setVerified(true)
            setStyle(styles.nums)
        }
    }

    const airTimeHandler = async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        let payload = {
            country: user.code,
            amount: airAmount,
            phone: phone,
            userID: id,
            asset: asset,
            address: address,
            private_key: pKey
        }
        axios.post("/airtime", payload)
            .then((data) => {
                if (data.data.id) {
                    console.log({ successMessage: data.data.message })
                    Alert.alert("Airtime Purcahse successful", `${(user.country === "Nigeria") ? `Comrade, your airtime purchase of ${payload.amount} was successful...` : `Your airtime purchase of ${payload.amount} was successful`}`, [
                        (user.country === "Nigeria") ? {
                            text: 'Oppor', onPress: () => {
                                navigation.navigate("Home")
                            }
                        } : {
                            text: 'Ok', onPress: () => {
                                navigation.navigate("Home")
                            }
                        }
                    ])
                }
                else {
                    Alert.alert("Airtime Purcahse failed", `${(user.country === "Nigeria") ? `Comrade, your airtime purchase of ${payload.amount} didn't go through, but no fear...` : `Your airtime purchase of ${payload.amount} didn't go through`}`, [
                        (user.country === "Nigeria") ? {
                            text: 'Oppor', onPress: () => {
                                navigation.navigate("Home")
                            }
                        } : {
                            text: 'Ok', onPress: () => {
                                navigation.navigate("Home")
                            }
                        }
                    ])
                    console.log({ message: data.data.message })
                }
            })
            .catch(err => {
                console.log({ Error: "Airtime error: " + err })
                Alert.alert("Airtime Purcahse failed", `${(user.country === "Nigeria") ? `Comrade, your airtime purchase of ${payload.amount} didn't go through, but no fear...` : `Your airtime purchase of ${payload.amount} didn't go through`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'Oppor', onPress: () => {
                            navigation.navigate("Home")
                        }
                    } : {
                        text: 'Ok', onPress: () => {
                            navigation.navigate("Home")
                        }
                    }
                ])
            })
    }

    return (
        <View style={styles.airContainer}>
            <Text style={styles.airText}>Amount: </Text>
            <View style={styles.airView}>
                <TextInput
                    style={style}
                    placeholder="100"
                    onChangeText={(val) => airAmountHandler(val)}
                    keyboardType="numeric"
                    returnKeyType="done"
                />
            </View>

            <Text style={styles.airText}>Phone: </Text>
            <View style={styles.airView}>
                <TextInput
                    style={styles.nums}
                    placeholder="200"
                    onChangeText={(val) => airphoneHandler(val)}
                    keyboardType="numeric"
                    returnKeyType="done"
                />
            </View>

            <View style={styles.assets}>
                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("FIAT")
                    airAmountHandler(airAmount)
                }}>
                    {asset === "FIAT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>Fiat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("BTC")
                    setAddress(user.wallets[0].address)
                    setPkey(user.wallets[0].privateKey)
                    airAmountHandler(airAmount)
                }}>
                    {asset === "BTC" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>BTC</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("BNB")
                    setAddress(user.wallets[1].address)
                    setPkey(user.wallets[1].privateKey)
                    airAmountHandler(airAmount)
                }}>
                    {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>BNB</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("ETH")
                    setAddress(user.wallets[2].address)
                    setPkey(user.wallets[2].privateKey)
                    airAmountHandler(airAmount)
                }}>
                    {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>ETH</Text>
                </TouchableOpacity>
            </View>

            {verified ?
                <View>
                    <TouchableOpacity
                        style={styles.paymentButton}
                        onPress={() => airTimeHandler()}
                    >
                        <Text style={styles.paymentButtonText}>Buy</Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }

            {/* <Modal visible={modalOpen} animationType="slide" style={styles.modal}>
                <View style={styles.modal}>
                    <Text style={styles.modalHeader}>
                    Airtime Purcahse successful
                    </Text>
                    <Text style={styles.modalText}>
                        {`${(country === "Nigeria") ? `Comrade, your airtime purchase of ${airAmount} was successful...` : `Your airtime purchase of ${airAmount} was successful`}`}
                    </Text>
                </View>
            </Modal> */}
        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#febf1226',
        alignItems: 'center',
        justifyContent: 'center',
    },
    airContainer: {
        flex: 1,
        backgroundColor: "#febf1226",
        paddingLeft: 20,
        paddingTop: 20,
    },
    airView: {
        marginBottom: 20,
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
    },
    assets: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 30,
    },
    asset: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    paymentButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        backgroundColor: "#febf12",
        padding: 10,
        borderRadius: 15,
        height: 50,
        marginRight: 20
    },
    paymentButtonText: {
        fontWeight: "800",
        color: "white",
    },
});

export default Airtime