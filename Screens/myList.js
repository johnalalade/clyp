import React, { useEffect, useState, Component } from "react";
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, RefreshControl, ImageBackground } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import axios from "./axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Avatar } from "react-native-paper";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from "expo-font";

const customFonts = {
    Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Optien: require("../assets/fonts/Optien.ttf"),
    Prompt: require("../assets/fonts/Prompt-ExtraBold.ttf")
};


function myListing({ navigation }) {

    const [isLoaded] = useFonts(customFonts);
    const [images, setImage] = React.useState([
        require('../assets/bitcoin.png'), require('../assets/litecoin.png'), require('../assets/binance.png'), require('../assets/ethereum.png'), require('../assets/coin.png'), require('../assets/tether.png'), require('../assets/tether(1).png'), require('../assets/tether(2).png')
    ])
    const [index, setIx] = React.useState(0)
    const [asset, setAsset] = useState("BTC")
    const [assets, setAssets] = useState([
        "BTC", "LTC", "BNB", "ETH", "TRX", "USDT", "USDT-BEP20", "USDT-TRC20"
    ])
    const [page, setPage] = useState(null)
    const [option, setOption] = useState("Sell")
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const [balance, setBalance] = useState()
    const [minRange, setMinRange] = useState("")
    const [maxRange, setMaxRange] = useState("")
    const [list, setList] = useState({})
    const [amount, setAmount] = useState()
    const [cleanup, setCleanUp] = React.useState(0)
    const [refreshing, setRefreshing] = React.useState(false)

    const [pKey, setPkey] = useState("")
    const [btc, setBTC] = useState()
    const [bnb, setBNB] = useState()
    const [eth, setETH] = useState()
    const [usdt, setUSDT] = useState()
    const [usdt_bep20, setUSDTBEP20] = useState()
    const [usdt_trc20, setUSDTTRC20] = useState()
    const [ltc, setLTC] = useState()
    const [trx, setTRX] = useState()

    // Value
    const [btcValue, setBTCValue] = React.useState()
    const [bnbValue, setBNBValue] = React.useState()
    const [ethValue, setETHValue] = React.useState()
    const [usdtValue, setUSDTValue] = React.useState()
    const [usdt_bep20Value, setUSDTBEP20Value] = React.useState()
    const [usdt_trc20Value, setUSDTTRC20Value] = React.useState()
    const [ltcValue, setLTCValue] = React.useState()
    const [trxValue, setTRXValue] = React.useState()

    const [value, setValue] = React.useState(0)

    const [address, setAddress0] = React.useState({
        name: "Bitcoin",
        privateKey: "xxxxxxxxxxxxxxxxxxxxxx",
        address: "xxxxxxxxxxxxxxxxxxxxxxxx",
        image: ""
    })
    const [vendors, setVendors] = useState([])
    const [vend, setVend] = useState([])
    const [id, setId] = useState("")
    const [amStyle, setAmStyle] = useState(styles.noErr)
    const [loading, setLoading] = React.useState(true)
    const [current, setCurrent] = React.useState({})


    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        setId(id)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
                setAddress0(data.data.response.wallets[0])
                setIx(0)
                console.log({ data: data.data.response })
                return data.data.response
            })
            .then(user => {
                axios.post('/current', { currency: user.currency })
                    .then(data => {
                        setCurrent({
                            bnb: data.data.bnb,
                            eth: data.data.eth,
                            usdt: data.data.usdt,
                            btc: data.data.btc,
                            ltc: data.data.ltc,
                            trx: data.data.trx
                        })
                    })

                axios.post('/all-mine', { userID: id })
                    .then(data => {
                        setVendors(option === "Sell" ? data.data.response.filter(v => v.option === "Sell") : data.data.response.filter(v => v.option === "Buy"))
                        setVend(data.data.response)
                        console.log(data.data.response)
                        setLoading(false)
                    })
                axios.post('/cryptobalance2', { asset: "BTC", address: user.wallets[0].address, currency: user.currency })
                    .then((data) => {
                        setBTC(data.data.balance)
                        setBTCValue(data.data.value_balance)
                        setBalance(data.data.balance)
                        setValue(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "LTC", address: user.wallets[1].address, currency: user.currency })
                    .then((data) => {
                        setLTC(data.data.balance)
                        setLTCValue(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get LTC balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "BNB", address: user.wallets[2].address, currency: user.currency })
                    .then((data) => {
                        setBNB(data.data.balance)
                        setBNBValue(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get BNB balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "ETH", address: user.wallets[3].address, currency: user.currency })
                    .then((data) => {
                        setETH(data.data.balance)
                        setETHValue(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get ETH balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "TRX", address: user.wallets[4].address, pKey: user.wallets[4].privateKey, currency: user.currency })
                    .then((data) => {
                        setTRX(data.data.balance)
                        setTRXValue(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get TRX balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT", address: user.wallets[5].address, currency: user.currency })
                    .then((data) => {
                        setUSDT(data.data.balance)
                        setUSDTValue(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT-BEP20", address: user.wallets[6].address, currency: user.currency })
                    .then((data) => {
                        setUSDTBEP20(data.data.balance)
                        setUSDTBEP20Value(data.data.value_balance)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT-BEP20 balance " + err })
                    })

                axios.post('/cryptobalance2', { asset: "USDT-TRC20", address: user.wallets[7].address, pKey: user.wallets[7].privateKey, currency: user.currency })
                    .then((data) => {
                        setUSDTTRC20(data.data.balance)
                        setUSDTTRC20Value(data.data.value_balance)
                        setRefreshing(false)
                        console.log(data.data.balance)
                    })
                    .catch((err) => {
                        console.log({ Err: "Unable to get USDT-TRC20 balance " + err })
                    })

            })
            .catch(err => {
                console.log({ Err: err })
                setRefreshing(false)
            })

    }, [cleanup])


    const deleting = () => {
        let data = {
            userID: list._id
        }
        axios.post("/deletep2p", data)
            .then(res => {
                setVendors(vendors.filter(v => v != list))
                Alert.alert("Delete Successful", "Listing has been successfully deleted")
            })
            .catch(err => {
                Alert.alert("Delete Error", "Listing could not be deleted")
            })
    }

    const register = () => {
        setLoading(true)
        let data = {
            amount: amount,
            minRange,
            maxRange,
            option,
            asset,
            userID: id,
            private_key: user.wallets[index].privateKey,
            address: user.wallets[index].address,
            available: value
        }

        if (option === "Sell") {

            if (minRange > maxRange) {
                Alert.alert('Range Error', `Invalid range please make sure your Maximum amount is greater than Minimum amount`)
                setLoading(false)
                return false
            }
            if (value < maxRange) {
                Alert.alert('Invalid amount', `Your maximum range is more than your current ${asset} balance`)
                setLoading(false)
                return false
            }
            if (minRange == "" || maxRange == "") {
                Alert.alert('Input Error', `Please indicate minium and maximum amount for each transaction`)
                setLoading(false)
                return false
            }
            if (option === "Sell") {
                if (maxRange > balance) {
                    Alert.alert('Insufficient Balance', `Your ${asset} balance is not sufficient for your maximum range specification`)
                    setLoading(false)
                    return false
                }
            }

        }
        if (option === "Buy") {

            if (minRange > maxRange) {
                Alert.alert('Range Error', `Invalid range please make sure your Maximum amount is greater than Minimum amount`)
                setLoading(false)
                return false
            }
            if (minRange == "" || maxRange == "") {
                Alert.alert('Input Error', `Please indicate minium and maximum amount for each transaction`)
                setLoading(false)
                return false
            }
        }

        axios.post('/list', data)
            .then(res => {
                setCleanUp(cleanup++)
                setLoading(false)
                Alert.alert('Listing Successfull', `You've Successfully listed ${asset} for P2P transaction`, [
                    {
                        text: "OK",
                        onPress: () => {
                            setPage(null)
                        }
                    }
                ])
                console.log(res.data)
            })
            .catch(err => {
                setLoading(false)
                Alert.alert('Listing Failed', `Your listing of ${asset} for P2P transaction failed`, [
                    {
                        text: "OK",
                        onPress: () => {
                            setPage(null)
                        }
                    }
                ])
                console.log(err)
            })
    }



    if (loading) {
        return (
            <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#febf12" />
            </View>
        )
    }

    if (!isLoaded) {
        return (
            <View></View>
        )
    }

    if (page === "List") {
        return (
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setPage(null)} style={styles.cancel}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>



                <View style={styles.options}>
                    <TouchableOpacity style={option === "Sell" ? styles.opActive : styles.opInActive} onPress={() => {
                        setOption("Sell")
                    }}>

                        <Text style={option === "Sell" ? styles.opTextActive : styles.opTextInActive} >Sell</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={option === "Buy" ? styles.opActive : styles.opInActive} onPress={() => {
                        setOption("Buy")
                    }}>

                        <Text style={option === "Buy" ? styles.opTextActive : styles.opTextInActive}>Buy</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.airContainer}>
                    <Text>Which asset will you like to {option}: </Text>

                    <Text style={styles.balance}>Balance: &#x20A6; {(balance / 1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} </Text>
                    <Text style={styles.value}>{value} {asset}</Text>

                    <ScrollView horizontal={true}>
                        <View style={styles.cryptoList}>
                            {
                                user.wallets.map((item, ix) => (
                                    <TouchableOpacity horizontal={true} style={ix !== index ? styles.crypCont : styles.crypContSelected} key={item.name} onPress={() => {
                                        setAsset(item.name); setIx(ix);
                                        setAddress0(item)

                                        if (item.name === "BTC") {
                                            setBalance(btc)
                                            setValue(btcValue)
                                        }
                                        if (item.name === "LTC") {
                                            setBalance(ltc)
                                            setValue(ltcValue)
                                        }
                                        if (item.name === "BNB") {
                                            setBalance(bnb)
                                            setValue(bnbValue)
                                        }
                                        if (item.name === "ETH") {
                                            setBalance(eth)
                                            setValue(ethValue)
                                        }
                                        if (item.name === "TRx") {
                                            setBalance(trx)
                                            setValue(trxValue)
                                        }
                                        if (item.name === "USDT") {
                                            setBalance(usdt)
                                            setValue(usdtValue)
                                        }
                                        if (item.name === "USDT-BEP20") {
                                            setBalance(usdt_bep20)
                                            setValue(usdt_bep20Value)
                                        }
                                        if (item.name === "USDT-TRC20") {
                                            setBalance(usdt_trc20)
                                            setValue(usdt_trc20Value)
                                        }

                                    }}>
                                        <Avatar.Image
                                            source={
                                                images[ix]
                                            }
                                            style={{ backgroundColor: "white" }}
                                            size={40}
                                        />
                                        <Text style={styles.crypText}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </ScrollView>

                    <Text style={styles.airText}>Min Amount: </Text>
                    <View style={styles.airView}>
                        <TextInput
                            style={styles.nums}
                            placeholder="100"
                            onChangeText={(val) => setMinRange(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.airText}>Max Amount: </Text>
                    <View style={styles.airView}>
                        <TextInput
                            style={styles.nums}
                            placeholder="100"
                            onChangeText={(val) => {
                                setMaxRange(val)
                            }}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <TouchableOpacity style={styles.paymentButton} onPress={() => register()}>
                        <Text style={styles.paymentButtonText} >List to {option}</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        )
    }

    return (
        <ImageBackground source={require('../assets/mash-up.png')} resizeMode="cover" style={styles.backgroundImage} imageStyle=
            {{ opacity: 0.2 }}>
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }} refreshControl={
                    <RefreshControl refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            setCleanUp(cleanup + 1)

                        }} />
                }>

                    <View>

                        <View style={styles.options}>
                            <TouchableOpacity style={option === "Sell" ? styles.opActive : styles.opInActive} onPress={() => {
                                setOption("Sell")
                                setVendors(vend.filter(v => v.option === "Sell"))
                            }}>
                                {/* <Ionicons name="checkmark" size={24} color="#febf12" /> */}
                                <Text style={option === "Sell" ? styles.opTextActive : styles.opTextInActive} >Sellings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={option === "Buy" ? styles.opActive : styles.opInActive} onPress={() => {
                                setOption("Buy")
                                setVendors(vend.filter(v => v.option === "Buy"))
                            }}>
                                {/* <Ionicons name="checkmark" size={24} color="#febf12" /> */}
                                <Text style={option === "Buy" ? styles.opTextActive : styles.opTextInActive}>Buyings</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <FlatList
                        keyExtractor={(item) => item.reference + item.name + item.amount + item.asset + item.minRange + item.maxRange + item.available + new Date}
                        data={vendors}
                        renderItem={({ item }) => ( */}
                        {vendors && vendors.map(item => (
                            <View style={styles.card}>

                                <View>

                                    <Text style={styles.cardName}>{item.asset}</Text>
                                    <View style={styles.cardDetBt}>

                                        <View style={styles.vCardPrice}>
                                            <Text>{item.name}</Text>
                                            <Text>{
                                                current && parseInt(item.asset === "BTC" && current.btc || item.asset === "BNB" && current.bnb || item.asset === "LTC" && current.ltc || item.asset === "ETH" && current.eth || item.asset === "TRX" && current.trx || item.asset.indexOf("USDT") !== -1 && current.usdt).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                            } {user.currency}</Text>

                                            <View style={styles.avaRange}>
                                                <Text style={styles.det}>Range: </Text>
                                                <Text>{item.minRange}
                                                    -
                                                    {item.maxRange} ({item.asset})
                                                </Text>
                                            </View>
                                            <View style={styles.avaRange}>
                                                <Text style={styles.det}>Available: </Text>
                                                <Text>{item.available} {item.asset}</Text>
                                            </View>
                                        </View>


                                    </View>

                                </View>

                                <TouchableOpacity style={styles.cardButton} onPress={() => {
                                    setPage("Purchase")
                                    setList(item)
                                    if (item.asset === "BTC") {
                                        setBalance(btc)
                                        setValue(btcValue)
                                    }
                                    if (item.asset === "LTC") {
                                        setBalance(ltc)
                                        setValue(ltcValue)
                                    }
                                    if (item.asset === "BNB") {
                                        setBalance(bnb)
                                        setValue(bnbValue)
                                    }
                                    if (item.asset === "ETH") {
                                        setBalance(eth)
                                        setValue(ethValue)
                                    }
                                    if (item.asset === "TRX") {
                                        setBalance(trx)
                                        setValue(trxValue)
                                    }
                                    if (item.asset === "USDT") {
                                        setBalance(usdt)
                                        setValue(usdtValue)
                                    }
                                    if (item.asset === "USDT-BEP20") {
                                        setBalance(usdt_bep20)
                                        setValue(usdt_bep20Value)
                                    }
                                    if (item.asset === "USDT-TRC20") {
                                        setBalance(usdt_trc20)
                                        setValue(usdt_trc20Value)
                                    }
                                    Alert.alert("Delete?", "Are you sure you want to delete this listing", [{
                                        text: "Yes", onPress: () => {
                                            deleting()
                                        }
                                    }, {
                                        text: "Cancel"
                                    }])
                                }}>
                                    <Text style={styles.cardButtonText}>Delete</Text>
                                </TouchableOpacity>

                            </View>
                        ))
                        }

                        {/* )}
                    /> */}



                    </View>

                </ScrollView>

                <View style={styles.float}>
                    <TouchableOpacity onPress={() => {
                        setPage("List")
                    }}>
                        <AntDesign style={styles.floatIcon} name="plus" size={44} color="whitesmoke" />
                    </TouchableOpacity>
                </View>


            </View>
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
    container: {
        flex: 1
    },
    value: {
        color: "black",
        fontSize: 15,
        fontWeight: "700",
        marginVertical: 10,
    },
    opActive: {
        backgroundColor: "#febf12",
        paddingHorizontal: 40,
        paddingVertical: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    opTextActive: {
        fontWeight: "800",
        color: "white",
        fontFamily: "Optien"
    },
    opInActive: {
        backgroundColor: "white",
        paddingHorizontal: 40,
        paddingVertical: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        fontFamily: "Optien"
    },
    opTextInActive: {
        fontWeight: "800",
        color: "grey",
    },
    options: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 25
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "100%",
        marginBottom: 15,
        borderWidth: 3,
        borderColor: "#febf1226",
    },
    card: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        margin: 15
    },
    cardName: {
        color: "#febf12",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 5,
        fontFamily: "Prompt"
    },
    cardDetBt: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    vCardPrice: {
        display: "flex",
    },
    avaRange: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: 5
    },
    det: {
        color: "gray",
        fontFamily: "Optien"
    },
    cardButton: {
        backgroundColor: "#fe8100",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15
    },
    cardButtonText: {
        color: "whitesmoke",
        fontWeight: "700",
    },
    airContainer: {
        flex: 1,
        // backgroundColor: "#febf1226",
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 150
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
        color: "whitesmoke",
    },
    cryptoList: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 50,
        marginBottom: 30
    },
    crypCont: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        minWidth: 100
    },
    crypContSelected: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        minWidth: 100,
        borderRadius: 30,
        borderWidth: 5,
        borderColor: "#febf12",
        padding: 10
    },
    float: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#febf12",
        width: 50,
        height: 50,
        borderRadius: 30,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    noErr: {
        opacity: 0,
    },
    err: {
        opacity: 1,
        color: "red"
    }
});


export default myListing