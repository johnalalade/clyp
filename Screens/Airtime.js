import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import axios from "./axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Avatar } from "react-native-paper";

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
    const [usdt, setUSDT] = React.useState()
    const [usdt_bep20, setUSDTBEP20] = React.useState()
    const [usdt_trc20, setUSDTTRC20] = React.useState()
    const [ltc, setLTC] = React.useState()
    const [trx, setTRX] = React.useState()
    const [balance, setBalance] = React.useState()
    const [modalOpen, setModalOpen] = React.useState(true)
    const [cleanup, setCleanUp] = React.useState(0)
    const [refreshing, setRefreshing] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
                setBalance(data.data.response.balance)
                console.log({ data: data.data.response })
                return data.data.response
            })
            .then(user => {
                axios.post('/cryptobalance2', { asset: "BTC", address: user.wallets[0].address })
                    .then((data) => {
                        setBTC(data.data.balance)
                        // setBalance(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "LTC", address: user.wallets[1].address })
                    .then((data) => {
                        setLTC(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get LTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "BNB", address: user.wallets[2].address })
                    .then((data) => {
                        setBNB(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BNB balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "ETH", address: user.wallets[3].address })
                    .then((data) => {
                        setETH(data.data.balance)
                        // setRefreshing(false)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get ETH balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "TRX", address: user.wallets[4].address, pKey: user.wallets[4].privateKey })
                    .then((data) => {
                        setTRX(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get TRX balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT", address: user.wallets[5].address })
                    .then((data) => {
                        setUSDT(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT-BEP20", address: user.wallets[6].address })
                    .then((data) => {
                        setUSDTBEP20(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT-BEP20 balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT-TRC20", address: user.wallets[7].address, pKey: user.wallets[7].privateKey })
                    .then((data) => {
                        setUSDTTRC20(data.data.balance)
                        setRefreshing(false)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT-TRC20 balance " + err })
                    })
            })
            .catch(err => {
                console.log({ Err: err })
            })

    }, [cleanup])

    const airAmountHandler = (val) => {
        setAirAmount(Number(val))

    }
    const airphoneHandler = (val) => {
        setPhone(val)
        if (val.length < 11) {
            setVerified(false)
        }
        else {
            setVerified(true)
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
        setLoading(true)
        if (payload.amount > balance) {
            setLoading(false)
            Alert.alert("Insufficient balance", `${(user.country === "Nigeria") ? `Comrade, your ${payload.asset} balance is insufficient for the payment you want to make...` : `Your ${payload.asset} balance is insufficient for the payment you want to make...`}`, [
                (user.country === "Nigeria") ? {
                    text: 'Fund', onPress: () => {
                        navigation.navigate("Home")
                    }
                } : {
                    text: 'Fund', onPress: () => {
                        navigation.navigate("Home")
                    }
                },
                {
                    text: 'Ok'
                }
            ])
            return false
        }
        if (payload.phone < 11) {
            setLoading(false)
            return false
        }
        axios.post("/airtime", payload)
            .then((data) => {
                if (data.data.id) {
                    setLoading(false)
                    console.log({ successMessage: data.data.message })
                    Alert.alert("Airtime Purchase successful", `${(user.country === "Nigeria") ? `Comrade, your airtime purchase of ${payload.amount} was successful...` : `Your airtime purchase of ${payload.amount} was successful`}`, [
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
                    setLoading(false)
                    Alert.alert("Airtime Purcahse failed", `${(user.country === "Nigeria") ? `Comrade, your airtime purchase of ${payload.amount} didn't go through, but no fear...` : `Your airtime purchase of ${payload.amount} didn't go through`}`, [
                        (user.country === "Nigeria") ? {
                            text: 'Ok', onPress: () => {
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
                setLoading(false)
                console.log({ Error: "Airtime error: " + err })
                Alert.alert("Airtime Purcahse failed", `${(user.country === "Nigeria") ? `Comrade, your airtime purchase of ${payload.amount} didn't go through, but no fear...` : `Your airtime purchase of ${payload.amount} didn't go through`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'Ok', onPress: () => {
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

    if (loading) {
        return (
            <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#febf12" />
            </View>
        )
    }

    return (
        <ScrollView style={{ flex: 1 }} refreshControl={
            <RefreshControl refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true)
                    setCleanUp(cleanup + 1)

                }} />
        }>
            <View style={styles.airContainer}>

                <Text style={styles.balance}>Balance: &#x20A6; {(balance / 1).toString().slice(0, 6)} </Text>
                <Text style={styles.airText}>Amount: </Text>
                <View style={styles.airView}>
                    <TextInput
                        style={styles.nums}
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

                <Text style={styles.payW}>Buy with: </Text>

                <ScrollView horizontal={true}>
                    <View style={styles.assets}>
                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("FIAT")
                            airAmountHandler(airAmount)
                            setBalance(user.balance)
                        }}>
                            {asset === "FIAT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>Fiat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("BTC")
                            setAddress(user.wallets[0].address)
                            setPkey(user.wallets[0].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(btc)
                        }}>
                            {asset === "BTC" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/bitcoin.png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>BTC</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("LTC")
                            setAddress(user.wallets[1].address)
                            setPkey(user.wallets[1].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(ltc)
                        }}>
                            {asset === "LTC" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/litecoin.png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>LTC</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("BNB")
                            setAddress(user.wallets[2].address)
                            setPkey(user.wallets[2].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(bnb)
                        }}>
                            {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/binance.png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>BNB</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("ETH")
                            setAddress(user.wallets[3].address)
                            setPkey(user.wallets[3].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(eth)
                        }}>
                            {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/ethereum.png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>ETH</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("TRX")
                            setAddress(user.wallets[4].address)
                            setPkey(user.wallets[4].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(trx)
                        }}>
                            {asset === "TRX" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/coin.png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>TRX</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("USDT")
                            setAddress(user.wallets[5].address)
                            setPkey(user.wallets[5].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(usdt)
                        }}>
                            {asset === "USDT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/tether.png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>USDT</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("USDT-BEP20")
                            setAddress(user.wallets[6].address)
                            setPkey(user.wallets[6].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(usdt_bep20)
                        }}>
                            {asset === "USDT-BEP20" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/tether(1).png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>USDT-BEP20</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("USDT-TRC20")
                            setAddress(user.wallets[7].address)
                            setPkey(user.wallets[7].privateKey)
                            airAmountHandler(airAmount)
                            setBalance(usdt_trc20)
                        }}>
                            {asset === "USDT-TRC20" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <View style={styles.coin}>
                                <Avatar.Image
                                    source={
                                        require('../assets/tether(2).png')
                                    }
                                    style={{ backgroundColor: "white" }}
                                    size={40}
                                />
                                <Text>USDT-TRC20</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

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
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: '#febf1226',
        alignItems: 'center',
        justifyContent: 'center',
    },
    airContainer: {
        flex: 1,
        // backgroundColor: "#febf1226",
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    airView: {
        marginBottom: 10,
    },
    balance: {
        fontWeight: "500",
        fontSize: 15
    },
    airText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: "600"
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "white",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
        borderWidth: 3,
        borderColor: "#febf12",
    },
    payW: {
        paddingVertical: 10,
        fontWeight: "900"
    },
    assets: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        minWidth: 100,
    },
    asset: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginHorizontal: 20,
    },
    coin: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
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