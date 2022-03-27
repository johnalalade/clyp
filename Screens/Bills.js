import React, { useEffect, Component, useState } from "react";
import { StyleSheet, Text, View, TextInput, Alert, RefreshControl, ImageBackground, } from "react-native";
import { FlatList, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import axios from "./axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cables from "./cables";
import data_bundles from "./data_bundles";
import internet from "./internet";
import power from "./power";
import toll from "./toll";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { useFonts } from "expo-font";

const customFonts = {
    Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Optien: require("../assets/fonts/Optien.ttf"),
    Prompt: require("../assets/fonts/Prompt-ExtraBold.ttf")
};

function Bills({ navigation }) {

    const [isLoaded] = useFonts(customFonts);
    const [page, setPage] = useState("Blank")
    const [prev, setPrev] = useState("")
    const [user, setUser] = React.useState()
    const [amount, setAmount] = useState(null)
    const [customer, setCustomer] = useState("")
    const [biller, setBiller] = useState(null)
    const [fee, setFee] = useState(null)
    const [bill, setBill] = useState(null)
    const [userID, setUserID] = useState(null)
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
    const [acc_name, setAcc_Name] = React.useState("")
    const [cleanup, setCleanUp] = React.useState(0)
    const [refreshing, setRefreshing] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [nmloading, setNmload] = React.useState("")



    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
                setBalance(data.data.response.balance)
                setAsset("FIAT")
                console.log({ data: data.data.response })
                return data.data.response
            })
            .then(user => {
                axios.post('/cryptobalance2', { asset: "BTC", address: user.wallets[0].address, currency: user.currency })
                    .then((data) => {
                        setBTC(data.data.balance)
                        // setBalance(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "LTC", address: user.wallets[1].address, currency: user.currency })
                    .then((data) => {
                        setLTC(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get LTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "BNB", address: user.wallets[2].address, currency: user.currency })
                    .then((data) => {
                        setBNB(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BNB balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "ETH", address: user.wallets[3].address, currency: user.currency })
                    .then((data) => {
                        setETH(data.data.balance)
                        // setRefreshing(false)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get ETH balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "TRX", address: user.wallets[4].address, pKey: user.wallets[4].privateKey, currency: user.currency })
                    .then((data) => {
                        setTRX(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get TRX balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT", address: user.wallets[5].address, currency: user.currency })
                    .then((data) => {
                        setUSDT(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT-BEP20", address: user.wallets[6].address, currency: user.currency })
                    .then((data) => {
                        setUSDTBEP20(data.data.balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT-BEP20 balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT-TRC20", address: user.wallets[7].address, pKey: user.wallets[7].privateKey, currency: user.currency })
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

    const billSelectHandler = (val) => {
        setAmount(val.amount)
        setBiller(val.name)
        setFee(val.fee)
        setBill(val)
        setPage(prev)

        // if (customer.length === 10) {
        //     axios.post('/validatebills', {
        //         item_code: val.item_code,
        //         biller_code: val.biller_code,
        //         customer
        //     })
        //         .then(data => {
        //             setAcc_Name(data.data.name)
        //             setVerified(true)

        //             if (data.data.message) {
        //                 Alert.alert("Incorrect details", "Account name could not be fetched")
        //             }
        //         })
        //         .catch(err => {
        //             console.log(err)

        //         })

        // }
    }

    const billSubmit = async (val) => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        let payload = {
            customer,
            amount,
            biller,
            fee,
            userID: id,
            asset: asset,
            address: address,
            private_key: pKey,
            currency: user.currency
        }
        setLoading(true)

        if (payload.asset === "FIAT") {
            if (payload.amount + payload.fee > user.balance) {
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
        }
        if (payload.asset === "BTC") {
            if (payload.amount + payload.fee > (btc + (btc / 2))) {
                setLoading(false)
                Alert.alert("Insufficient balance", `${(user.country === "Nigeria") ? `Comrade, your ${payload.asset} balance is insufficient for the payment you want to make...` : `Your ${payload.asset} balance is insufficient for the payment you want to make...`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    } : {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    },
                    {
                        text: 'Ok'
                    }
                ])
                return false
            }
        }
        if (payload.asset === "BNB") {
            if (payload.amount + payload.fee > (bnb + (bnb / 4))) {
                setLoading(false)
                Alert.alert("Insufficient balance", `${(user.country === "Nigeria") ? `Comrade, your ${payload.asset} balance is insufficient for the payment you want to make...` : `Your ${payload.asset} balance is insufficient for the payment you want to make...`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    } : {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    },
                    {
                        text: 'Ok'
                    }
                ])
                return false
            }
        }
        if (payload.asset === "ETH") {
            if (payload.amount + payload.fee > (eth / (eth / 2))) {
                setLoading(false)
                Alert.alert("Insufficient balance", `${(user.country === "Nigeria") ? `Comrade, your ${payload.asset} balance is insufficient for the payment you want to make...` : `Your ${payload.asset} balance is insufficient for the payment you want to make...`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    } : {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    },
                    {
                        text: 'Ok'
                    }
                ])
                return false
            }
        }
        if (payload.asset === "USDT") {
            if (payload.amount + payload.fee > (usdt / (usdt / 2))) {
                setLoading(false)
                Alert.alert("Insufficient balance", `${(user.country === "Nigeria") ? `Comrade, your ${payload.asset} balance is insufficient for the payment you want to make...` : `Your ${payload.asset} balance is insufficient for the payment you want to make...`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    } : {
                        text: 'Fund', onPress: () => {
                            navigation.navigate("Crypto")
                        }
                    },
                    {
                        text: 'Ok'
                    }
                ])
                return false
            }
        }
        axios.post("/bills", payload)
            .then((data) => {
                if (data.data.id) {
                    setLoading(false)
                    console.log({ successMessage: data.data.message })
                    Alert.alert("Bill Payment successful", `${(user.country === "Nigeria") ? `Comrade, your bill payment of ${payload.amount} for ${payload.biller} was successful...` : `Your bill payment of ${payload.amount} for ${payload.biller} was successful...`}`, [
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
                    setCleanUp(cleanup + 1)
                }
                else {
                    setLoading(false)
                    Alert.alert("Bill payment failed", `${(user.country === "Nigeria") ? `Comrade, your bill payment of ${payload.amount} for ${payload.biller} didn't go through, but no fear...` : `Your bill payment of ${payload.amount} for ${payload.biller} didn't go through, but no fear...`}`, [
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
                    setCleanUp(cleanup + 1)
                    console.log({ message: data.data.message })
                }
            })
            .catch(err => {
                setLoading(false)
                console.log({ Error: "Airtime error: " + err })
                Alert.alert("Bill payment failed", `${(user.country === "Nigeria") ? `Comrade, your bill payment of ${payload.amount} for ${payload.biller} didn't go through, but no fear...` : `Your bill payment of ${payload.amount} for ${payload.biller} didn't go through, but no fear...`}`, [
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
                setCleanUp(cleanup + 1)
            })
    }

    const acc_numHandler = (val) => {
        setCustomer(val)
        if (val.length === 10 && bill !== null) {
            // toast.info("Please wait while we fetch account name")
            setNmload(true)
            axios.post('/validatebills', {
                item_code: bill.item_code,
                biller_code: bill.biller_code,
                customer: val
            })
                .then(data => {
                    console.log(data.data)
                    console.log(val)
                    setAcc_Name(data.data.name)
                    setVerified(true)
                    setNmload(false)
                    if (data.data.message) {
                        Alert.alert("Incorrect details", "Account name could not be fetched")
                    }
                })
                .catch(err => {
                    console.log(err)

                })
        }
    }

    if (loading) {
        return (
            <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#febf12" />
            </View>
        )
    }

    if (page === "Cables") {
        return (
            <ScrollView>
                <View style={styles.wcont}>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null); setAcc_Name("") }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Cables & Entertainment</Text>

                    {user.currency === "NGN" ?
                        <Text style={styles.balance}>Balance: &#x20A6; {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                        :
                        <Text style={styles.balance}>Balance: {user.currency} {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                    }

                    <Text style={styles.billText}>Option: </Text>
                    <TouchableOpacity onPress={() => {
                        setPrev("Cables"); setPage("cables_pick");
                    }}
                        style={styles.billView}>

                        <Text style={styles.nums}>{bill ? `${bill.name} (${bill.amount})` : null}</Text>
                    </TouchableOpacity>

                    <Text style={styles.billText}>Smart card Number/ICU: </Text>
                    <View style={styles.billView}>

                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => acc_numHandler(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.withdrawText}>Customer Name(Auto-fill) {nmloading ? <ActivityIndicator size="small" color="#febf12" /> : null} : </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

                    <Text style={styles.payW}>Buy with: </Text>

                    <ScrollView horizontal={true}>
                        <View style={styles.assets}>
                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("FIAT")
                                setBalance(user.balance)
                            }}>
                                {asset === "FIAT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                                <Text>Fiat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("BTC")
                                setAddress(user.wallets[0].address)
                                setPkey(user.wallets[0].privateKey)
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
                                onPress={() => { billSubmit() }}
                            >
                                <Text style={styles.paymentButtonText}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </View>
            </ScrollView>
        )
    }
    if (page === "cables_pick") {
        return (
            <View style={styles.wcont}>
                <TouchableOpacity onPress={() => { setPage(prev); }} style={styles.cancel}>
                    <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
                {/* <TextInput
                    style={styles.numsSearch}
                    placeholder="search"
                    onChangeText={(val) => searchHandler(val)}
                // returnKeyType="done"
                /> */}
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={cables.filter(i => i.country === user.code).sort((a, b) => {
                        if (a.name > b.name) return 1
                        if (a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                {user.country === "Nigeria" ?
                                    <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
                                    :
                                    <Text style={styles.txText}>{item.name} ({user.currency} {item.amount})</Text>
                                }
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    if (page === "data_bundle") {
        return (
            <ScrollView>
                <View style={styles.wcont}>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null); setAcc_Name("") }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Data Bundles</Text>

                    {user.currency === "NGN" ?
                        <Text style={styles.balance}>Balance: &#x20A6; {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                        :
                        <Text style={styles.balance}>Balance: {user.currency} {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                    }

                    <Text style={styles.billText}>Option: </Text>
                    <TouchableOpacity onPress={() => {
                        setPrev("data_bundle"); setPage("data_pick");
                    }}
                        style={styles.billView}>

                        <Text style={styles.nums}>{bill ? `${bill.name} (${bill.amount})` : null}</Text>
                    </TouchableOpacity>

                    <Text style={styles.billText}>Phone: </Text>
                    <View style={styles.billView}>

                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => setCustomer(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

                    {/* <Text style={styles.withdrawText}>Customer Name(Auto-fill): </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View> */}

                    {/* {verified ? */}

                    <Text style={styles.payW}>Buy with: </Text>

                    <ScrollView horizontal={true}>
                        <View style={styles.assets}>
                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("FIAT")
                                setBalance(user.balance)
                            }}>
                                {asset === "FIAT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                                <Text>Fiat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("BTC")
                                setAddress(user.wallets[0].address)
                                setPkey(user.wallets[0].privateKey)
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

                    <View>
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={() => { billSubmit() }}
                        >
                            <Text style={styles.paymentButtonText}>Buy</Text>
                        </TouchableOpacity>
                    </View>
                    {/* : null
                    } */}

                </View>
            </ScrollView>
        )
    }
    if (page === "data_pick") {
        return (
            <View style={styles.wcont}>
                <TouchableOpacity onPress={() => { setPage(prev); }} style={styles.cancel}>
                    <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
                {/* <TextInput
                    style={styles.numsSearch}
                    placeholder="search"
                    onChangeText={(val) => searchHandler(val)}
                // returnKeyType="done"
                /> */}
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={data_bundles.filter(i => i.country === user.code).sort((a, b) => {
                        if (a.name > b.name) return 1
                        if (a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                {user.country === "Nigeria" ?
                                    <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
                                    :
                                    <Text style={styles.txText}>{item.name} ({user.currency} {item.amount})</Text>
                                }
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    if (page === "power") {
        return (
            <ScrollView>
                <View style={styles.wcont}>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null); setAcc_Name("") }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Power & Utilities</Text>

                    {user.currency === "NGN" ?
                        <Text style={styles.balance}>Balance: &#x20A6; {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                        :
                        <Text style={styles.balance}>Balance: {user.currency} {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                    }

                    <Text style={styles.billText}>Option: </Text>
                    <TouchableOpacity onPress={() => {
                        setPrev("power"); setPage("power_pick");
                    }} style={styles.billView}>

                        <Text style={styles.nums}>{bill ? `${bill.name} (${bill.amount})` : null}</Text>
                    </TouchableOpacity>

                    <Text style={styles.billText}>Meter Number: </Text>
                    <View style={styles.billView}>

                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => acc_numHandler(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.withdrawText}>Customer(Auto-fill) {nmloading ? <ActivityIndicator size="small" color="#febf12" /> : null} : </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

                    <Text style={styles.payW}>Buy with: </Text>

                    <ScrollView horizontal={true}>
                        <View style={styles.assets}>
                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("FIAT")
                                setBalance(user.balance)
                            }}>
                                {asset === "FIAT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                                <Text>Fiat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("BTC")
                                setAddress(user.wallets[0].address)
                                setPkey(user.wallets[0].privateKey)
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
                                onPress={() => { billSubmit() }}
                            >
                                <Text style={styles.paymentButtonText}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }

                </View>
            </ScrollView>
        )
    }
    if (page === "power_pick") {
        return (
            <View style={styles.wcont}>
                <TouchableOpacity onPress={() => { setPage(prev); }} style={styles.cancel}>
                    <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
                {/* <TextInput
                    style={styles.numsSearch}
                    placeholder="search"
                    onChangeText={(val) => searchHandler(val)}
                // returnKeyType="done"
                /> */}
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={power.filter(i => i.country === user.code).sort((a, b) => {
                        if (a.name > b.name) return 1
                        if (a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                {user.country === "Nigeria" ?
                                    <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
                                    :
                                    <Text style={styles.txText}>{item.name} ({user.currency} {item.amount})</Text>
                                }
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    if (page === "internet") {
        return (
            <ScrollView>
                <View style={styles.wcont}>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null); setAcc_Name("") }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Internet Subscription</Text>

                    {user.currency === "NGN" ?
                        <Text style={styles.balance}>Balance: &#x20A6; {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                        :
                        <Text style={styles.balance}>Balance: {user.currency} {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                    }

                    <Text style={styles.billText}>Option: </Text>
                    <TouchableOpacity onPress={() => {
                        setPrev("internet"); setPage("internet_pick");
                    }} style={styles.billView}>

                        <Text style={styles.nums}>{bill ? `${bill.name} (${bill.amount})` : null}</Text>
                    </TouchableOpacity>

                    <Text style={styles.billText}>Account Number: </Text>
                    <View style={styles.billView}>

                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => acc_numHandler(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.withdrawText}>Customer Name(Auto-fill) {nmloading ? <ActivityIndicator size="small" color="#febf12" /> : null} : </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

                    <Text style={styles.payW}>Buy with: </Text>

                    <ScrollView horizontal={true}>
                        <View style={styles.assets}>
                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("FIAT")
                                setBalance(user.balance)
                            }}>
                                {asset === "FIAT" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                                <Text>Fiat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.asset} onPress={() => {
                                setAsset("BTC")
                                setAddress(user.wallets[0].address)
                                setPkey(user.wallets[0].privateKey)
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
                                onPress={() => { billSubmit() }}
                            >
                                <Text style={styles.paymentButtonText}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }

                </View>
            </ScrollView>
        )
    }
    if (page === "internet_pick") {
        return (
            <View style={styles.wcont}>
                <TouchableOpacity onPress={() => { setPage(prev); }} style={styles.cancel}>
                    <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
                {/* <TextInput
                    style={styles.numsSearch}
                    placeholder="search"
                    onChangeText={(val) => searchHandler(val)}
                // returnKeyType="done"
                /> */}
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={internet.filter(i => i.country === user.code).sort((a, b) => {
                        if (a.name > b.name) return 1
                        if (a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                {user.country === "Nigeria" ?
                                    <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
                                    :
                                    <Text style={styles.txText}>{item.name} ({user.currency} {item.amount})</Text>
                                }
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    if (!isLoaded) {
        return (
            <View></View>
        )
    }

    return (
        <ImageBackground source={require('../assets/mash-up.png')} resizeMode="cover" style={styles.backgroundImage} imageStyle=
            {{ opacity: 0.2 }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true)
                        setCleanUp(cleanup + 1)

                    }} />
            }>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.options} onPress={() => { setPage("Cables") }}>

                        <Avatar.Image
                            source={
                                require('../assets/undraw_monitor_iqpq.png')
                            }
                            style={{ backgroundColor: "#febf1226" }, styles.avt}
                            size={70}
                        />

                        <Text style={styles.optionHead}>Cables & Entertainment</Text>
                        <Text style={styles.optionText}>Pay for your entertainment bill (e.g DSTV, GoTV, Strong, Nova etc) all with your fiat or crypto balance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.options} onPress={() => { setPage("data_bundle") }}>
                        <Avatar.Image
                            source={
                                require('../assets/undraw_Mobile_app_re_catg.png')
                            }
                            style={{ backgroundColor: "#febf1226" }, styles.avt}
                            size={70}
                        />
                        <Text style={styles.optionHead}>Data Bundles</Text>
                        <Text style={styles.optionText}>Get data bundles with your Fiat or Crypto balance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.options} onPress={() => { setPage("power") }}>
                        <Avatar.Image
                            source={
                                require('../assets/undraw_lightbulb_moment_re_ulyo.png')
                            }
                            style={{ backgroundColor: "#febf1226" }, styles.avt}
                            size={70}
                        />
                        <Text style={styles.optionHead}>Power & Utilities</Text>
                        <Text style={styles.optionText}>Pay for your power bill, water and other utilities all with your Fiat and Crypto balance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.options} onPress={() => { setPage("internet") }}>
                        <Avatar.Image
                            source={
                                require('../assets/undraw_Internet_on_the_go_re_vben.png')
                            }
                            style={{ backgroundColor: "#febf1226" }, styles.avt}
                            size={70}
                        />
                        <Text style={styles.optionHead}>Internet</Text>
                        <Text style={styles.optionText}>Pay for internet subscriptions with your Fiat or Crypto balance</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    )

}

const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
    },
    cancel: {
        top: 0,
        marginBottom: 20,
        marginTop: 10,
    },
    convertTop: {
        fontWeight: '900',
        alignSelf: "center",
        marginBottom: 20,
        fontFamily: "Optien"
    },
    wcont: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        paddingHorizontal: 15,
        paddingBottom: 30,
    },
    balance: {
        fontWeight: '600',
        marginBottom: 5,
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
        borderWidth: 3,
        borderColor: "#febf1226",
    },
    txTouch: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingVertical: 7,
    },
    txText: {
        marginLeft: 5,
        fontWeight: "700",
        marginVertical: 5
    },
    txTextSub: {
        marginLeft: 5
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
        height: 50
    },
    paymentButtonText: {
        fontWeight: "800"
    },
    payW: {
        paddingVertical: 20,
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
    container: {
        flex: 1,
        padding: 15,

    },
    options: {
        // backgroundColor: "white",
        backgroundColor: '#febf1226',
        marginBottom: 10,
        padding: 20,
        borderRadius: 20
    },
    optionHead: {
        fontWeight: "900",
        color: "#febf12",
        fontFamily: "Prompt",
    },
    optionText: {
        paddingTop: 5,
        fontFamily: "Optien",
        // color: "#febf12"
    },
    avt: {
        marginBottom: 10
    },
    billText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: "600"
    },
    billView: {
        marginBottom: 10
    }
})

export default Bills