import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import axios from "./axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Airtime() {
    const [airAmount, setAirAmount] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [user, setUser] = React.useState()
    const [style, setStyle] = React.useState(styles.nums)
    const [verified, setVerified] = React.useState(false)
    const [asset, setAsset] = React.useState("Fiat")
    const [address, setAddress] = React.useState("")
    const [pKey, setPkey] = React.useState("")
    const [btc, setBTC] = React.useState()
    const [bnb, setBNB] = React.useState()
    const [eth, setETH] = React.useState()

    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
            })
            .catch(err => {
                console.log({ Err: err })
            })

        axios.post('/cryptobalance', { asset: "BTC", address: user.wallet[0].address })
            .then((data) => {
                setBTC(data.data.balance)
                console.log(data.data.balance)
            })
            .catch((err) => {
                console.log({ Err: "Unable to get Crypto balance " + err })
            })

        axios.post('/cryptobalance', { asset: "BNB", address: user.wallet[1].address })
            .then((data) => {
                setBNB(data.data.balance)
                console.log(data.data.balance)
            })
            .catch((err) => {
                console.log({ Err: "Unable to get Crypto balance " + err })
            })

        axios.post('/cryptobalance', { asset: "ETH", address: user.wallet[2].address })
            .then((data) => {
                setETH(data.data.balance)
                console.log(data.data.balance)
            })
            .catch((err) => {
                console.log({ Err: "Unable to get Crypto balance " + err })
            })

    }, [])

    const airAmountHandler = (val) => {
        setAirAmount(val)
        if (val < 100 && phone.length === 0) {
            setStyle(styles.error)
            setVerified(false)
        }
        if (asset === "Fiat" && phone.length === 0) {
            if (val > user.balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BTC" && phone.length === 0) {
            let balance = btc / 1957 * user.rate

            if (val >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BNB" && phone.length === 0) {
            let balance = bnb / 242205133645110.0000 * user.rate


            if (val >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "ETH" && phone.length === 0) {
            let balance = eth / 242205133645110.0000 * user.rate

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
        if (asset === "Fiat" && phone.length === 0) {
            if (airAmount > user.balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BTC" && phone.length === 0) {
            let balance = btc / 1957 * user.rate

            if (airAmount >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "BNB" && phone.length === 0) {
            let balance = bnb / 242205133645110.0000 * user.rate


            if (airAmount >= balance) {
                setStyle(styles.error)
                setVerified(false)
            }
        }
        else if (asset === "ETH" && phone.length === 0) {
            let balance = eth / 242205133645110.0000 * user.rate

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
            country: user.country,
            amoutnt: airAmount,
            phone: phone,
            userID: id,
            asset: asset,
            address: address,
            private_key: pKey
        }
        axios.post("/airtime", payload)
            .then((data) => {
                console.log({ message: data.data.message })
            })
            .catch(err => {
                console.log({ Error: "Airtime error: " + err })
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
                    setAsset("Fiat")
                    airAmountHandler(airAmount)
                }}>
                    {asset === "Fiat" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>Fiat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("BTC")
                    setAddress(user.wallet[0].address)
                    setPkey(user.wallet[0].privateKey)
                    airAmountHandler(airAmount)
                }}>
                    {asset === "BTC" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>BTC</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("BNB")
                    setAddress(user.wallet[1].address)
                    setPkey(user.wallet[1].privateKey)
                    airAmountHandler(airAmount)
                }}>
                    {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>BNB</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => {
                    setAsset("ETH")
                    setAddress(user.wallet[2].address)
                    setPkey(user.wallet[2].privateKey)
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
    airContainer: {
        flex: 1,
        backgroundColor: "white",
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