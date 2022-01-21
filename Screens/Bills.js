import React, { useEffect, Component, useState } from "react";
import { StyleSheet, Text, View, TextInput, Alert, Modal } from "react-native";
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
import { Avatar } from "react-native-paper";


function Bills({ navigation }) {

    const [page, setPage] = useState("Blank")
    const [prev, setPrev] = useState("")
    const [user, setUser] = React.useState()
    const [amount, setAmount] = useState(null)
    const [customer, setCustomer] = useState(null)
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
    const [balance, setBalance] = React.useState()
    const [acc_name, setAcc_Name] = React.useState("")



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

    const billSelectHandler = (val) => {
        setAmount(val.amount)
        setBiller(val.name)
        setFee(val.fee)
        setBill(val)
        setPage(prev)

        axios.post('/validatebills', {
            item_code: val.item_code,
            biller_code: val.biller_code,
            customer
        })
            .then(data => {
                setAcc_Name(data.data.name)
                setVerified(true)

                if (data.data.message) {
                    Alert.alert("Incorrect details", "Account name could not be fetched")
                }
            })
            .catch(err => {
                console.log(err)

            })
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
            private_key: pKey
        }

        if (payload.asset === "FIAT") {
            if (payload.amount + payload.fee > user.balance) {
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
            if (payload.amount + payload.fee > btc) {
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
            if (payload.amount + payload.fee > bnb) {
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
            if (payload.amount + payload.fee > eth) {
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
                }
                else {
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
                    console.log({ message: data.data.message })
                }
            })
            .catch(err => {
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
            })
    }

    const acc_numHandler = (val) => {
        setCustomer(val)
        if (val.length === 10 && bank.Code) {
            // toast.info("Please wait while we fetch account name")
            axios.post('/validatebills', {
                item_code: bill.item_code,
                biller_code: bill.biller_code,
                customer
            })
                .then(data => {
                    setAcc_Name(data.data.name)
                    setVerified(true)

                    if (data.data.message) {
                        Alert.alert("Incorrect details", "Account name could not be fetched")
                    }
                })
                .catch(err => {
                    console.log(err)

                })
        }
    }

    if (page === "Cables") {
        return (
            <ScrollView>
                <View style={styles.wcont}>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null) }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Cables & Entertainment</Text>

                    <Text style={styles.balance}>Balance: &#x20A6; {balance} </Text>

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

                    <Text style={styles.withdrawText}>Customer Name(Auto-fill): </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

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
                            <Text>BTC</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("BNB")
                            setAddress(user.wallets[1].address)
                            setPkey(user.wallets[1].privateKey)
                            setBalance(bnb)
                        }}>
                            {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>BNB</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("ETH")
                            setAddress(user.wallets[2].address)
                            setPkey(user.wallets[2].privateKey)
                            setBalance(eth)
                        }}>
                            {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>ETH</Text>
                        </TouchableOpacity>
                    </View>

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
                    data={cables.filter(i => i.country === user.code).sort((a,b) => {
                        if(a.name > b.name) return 1
                        if(a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
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
                <View>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null) }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Data Bundles</Text>

                    <Text style={styles.balance}>Balance: &#x20A6; {balance} </Text>

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
                            <Text>BTC</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("BNB")
                            setAddress(user.wallets[1].address)
                            setPkey(user.wallets[1].privateKey)
                            setBalance(bnb)
                        }}>
                            {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>BNB</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("ETH")
                            setAddress(user.wallets[2].address)
                            setPkey(user.wallets[2].privateKey)
                            setBalance(eth)
                        }}>
                            {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>ETH</Text>
                        </TouchableOpacity>
                    </View>

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
                    data={data_bundles.filter(i => i.country === user.code).sort((a,b) => {
                        if(a.name > b.name) return 1
                        if(a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
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
                <View>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null) }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Power & Utilities</Text>

                    <Text style={styles.balance}>Balance: &#x20A6; {balance} </Text>

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

                    <Text style={styles.withdrawText}>Customer: (Auto-fill): </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

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
                            <Text>BTC</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("BNB")
                            setAddress(user.wallets[1].address)
                            setPkey(user.wallets[1].privateKey)
                            setBalance(bnb)
                        }}>
                            {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>BNB</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("ETH")
                            setAddress(user.wallets[2].address)
                            setPkey(user.wallets[2].privateKey)
                            setBalance(eth)
                        }}>
                            {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>ETH</Text>
                        </TouchableOpacity>
                    </View>

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
                    data={power.filter(i => i.country === user.code).sort((a,b) => {
                        if(a.name > b.name) return 1
                        if(a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
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
                <View>

                    <TouchableOpacity onPress={() => { setPage(null); setBill(null) }} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.convertTop}>Pay for Internet Subscription</Text>

                    <Text style={styles.balance}>Balance: &#x20A6; {balance} </Text>

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

                    <Text style={styles.withdrawText}>Customer Name(Auto-fill): </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    <Text style={styles.fee}>Fee: &#x20A6; {bill ? bill.fee : null}</Text>

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
                            <Text>BTC</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("BNB")
                            setAddress(user.wallets[1].address)
                            setPkey(user.wallets[1].privateKey)
                            setBalance(bnb)
                        }}>
                            {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>BNB</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.asset} onPress={() => {
                            setAsset("ETH")
                            setAddress(user.wallets[2].address)
                            setPkey(user.wallets[2].privateKey)
                            setBalance(eth)
                        }}>
                            {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                            <Text>ETH</Text>
                        </TouchableOpacity>
                    </View>

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
                    data={internet.filter(i => i.country === user.code).sort((a,b) => {
                        if(a.name > b.name) return 1
                        if(a.name < b.name) return -1
                        return 0
                    })}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => billSelectHandler(item)}>

                            <View>
                                <Text style={styles.txText}>{item.name} (&#x20A6; {item.amount})</Text>
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }


    return (
        <ScrollView>
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
    )

}

const styles = StyleSheet.create({
    cancel: {
        top: 0,
        marginBottom: 20,
        marginTop: 10
    },
    convertTop: {
        fontWeight: '900',
        alignSelf: "center",
        marginBottom: 20
    },
    wcont: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        paddingLeft: 15,
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
    },
    txTouch: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    txText: {
        marginLeft: 5,
        fontWeight: "700"
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
    container: {
        flex: 1
    },
    options: {
        // backgroundColor: "white",
        backgroundColor: '#febf1226',
        marginBottom: 10,
        padding: 20
    },
    optionHead: {
        fontWeight: "900",
        color: "#febf12"
    },
    optionText: {
        paddingTop: 5
        // color: "#febf12"
    },
    avt: {
        marginBottom: 10
    }
})

export default Bills