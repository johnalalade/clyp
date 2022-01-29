import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView, RefreshControl, Alert } from "react-native";
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
import { PayWithFlutterwave } from 'flutterwave-react-native';
import banks from "./available_banks";
import { UserInterfaceIdiom } from "expo-constants";
import axios from './axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native-paper";
import * as Clipboard from 'expo-clipboard';

const FiatStack = createStackNavigator()

function Fiat({ navigation }) {


    const [option, setOption] = React.useState("None")

    const [amount, setAmount] = React.useState(0)
    const [currency, setcurrency] = React.useState("NGN")
    const [page, setPage] = React.useState("Fiat")
    const [id, setID] = React.useState()

    const [user, setUser] = React.useState({})

    const [cleanup, setCleanUp] = React.useState(0)
    const [refreshing, setRefreshing] = React.useState(false)

    // const [abanks, setBanks] = React.useState(banks)

    // const [wamount, setWAmount] = React.useState(banks)
    // const [acc_num, setAcc_Num] = React.useState(banks)
    // const [acc_name, setAcc_Name] = React.useState(banks)
    // const [bank, setBank] = React.useState("")

    const [abanks, setBanks] = React.useState(banks)
    const [abanks2, setBanks2] = React.useState(banks)
    const [wamount, setWAmount] = React.useState(0)
    const [acc_num, setAcc_Num] = React.useState("")
    const [acc_name, setAcc_Name] = React.useState("")
    const [camount, setCAmount] = React.useState(false)
    const [bank, setBank] = React.useState("")
    const [bank_code, setBank_Code] = React.useState("")

    // Airtime
    const [airAmount, setAirAmount] = React.useState()
    const [phone, setPhone] = React.useState()
    // const [user, setUser] = React.useState()
    const [style, setStyle] = React.useState(styles.nums)
    const [verified, setVerified] = React.useState(false)
    const [loading, setLoading] = React.useState(false)


    const [txs, setTxs] = React.useState([
        {
            name: "Withdrawal",
            amount: 100,
            reference: 100
        },
        {
            name: "Withdrawal",
            amount: 100,
            reference: 101
        },
        {
            name: "Withdrawal",
            amount: 100,
            reference: 1002
        },
        {
            name: "Withdrawal",
            amount: 100,
            reference: 104
        }
    ])

    let bs = React.createRef();
    let fall = new Animated.Value(1);

    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        setID(id)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
                setTxs(data.data.response.transactions)
                setRefreshing(false)
                console.log({ data: data.data.response })
                return data.data.response
            })
            .then(resp => {
                setBanks2(abanks.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return -1
                    }
                    if (a.Name > b.Name) {
                        return 1
                    }
                    return 0
                }).filter((it) => it.country === resp.country))
            })
            .catch(err => {
                setRefreshing(false)
            })

    }, [cleanup])


    const handleOnRedirect = async (data) => {
        let id = await AsyncStorage.getItem('id').then(value => value)

        console.log(data);
        let payload = {
            amount: amount,
            userID: id,
            reference: data.tx_ref
        }
        if (data.status === "successful") {
            axios.post('/fundaccount', payload)
                .then(data => {
                    if (data.data.id) {
                        console.log("Successfully funded your fiat wallet")
                        axios.post('/user', { userID: id })
                            .then((data) => {
                                setUser(data.data.response)
                                setPage("Fiat")
                                console.log({ data: data.data.response })
                                return data.data.response
                            })
                            .catch(err => {

                            })
                        return data
                    }

                })
                // .then(res => {
                //     axios.post('/user', { userID: id })
                //         .then((data) => {
                //             setUser(data.data.response)
                //             setPage("Fiat")
                //             console.log({ data: data.data.response })
                //             return data.data.response
                //         })
                //         .catch(err => {

                //         })
                // })
                .catch(err => {
                    console.log("Failure to funded your fiat wallet: " + err)
                })
        }
    };

    if (loading) {
        return (
            <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#febf12" />
            </View>
        )
    }


    if (page === "Fund") {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View>
                        <TouchableOpacity onPress={() => setPage("Fiat")} style={styles.cancel}>
                            <Feather name="x" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.option} onPress={() => setOption("Bank")}>
                            <FontAwesome name="bank" size={35} color="whitesmoke" />
                            <Text style={styles.optionText}>
                                Fund with bank transfer
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.option} onPress={() => setOption("Card")}>
                            <Ionicons
                                name="card-outline"
                                size={44}
                                color="whitesmoke" />
                            <Text style={styles.optionText}>
                                Fund with bank Card
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Crypto")}>
                            <Entypo
                                name="cycle"
                                size={44}
                                color="whitesmoke" />
                            <Text style={styles.optionText}>
                                Convert your crypto balance to Fiat
                            </Text>
                        </TouchableOpacity>

                        {(option === "Card") ?
                            <View>
                                <Text style={{
                                    marginTop: 35, fontWeight: "600"
                                }} >Amount</Text>
                                <View style={styles.input}>
                                    <Ionicons
                                        name="card-outline"
                                        size={44}
                                        color="grey" />
                                    <TextInput
                                        placeholder="Amount"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                        enablesReturnKeyAutomatically
                                        onChangeText={(val) => setAmount(parseInt(val))}
                                    />
                                </View>
                                {amount >= 100 &&
                                    <PayWithFlutterwave
                                        onRedirect={handleOnRedirect}
                                        options={{
                                            tx_ref: + user._id + Date.now,
                                            authorization: 'FLWPUBK-b73d166127557d9fc24d219eb9ac96e2-X',
                                            customer: {
                                                email: user.email
                                            },
                                            amount: amount,
                                            currency: user.currency,
                                            payment_options: 'card'
                                        }}
                                        customButton={(props) => (
                                            <TouchableOpacity
                                                style={styles.paymentButton}
                                                onPress={props.onPress}
                                                isBusy={props.isInitializing}
                                                disabled={props.disabled}>
                                                <Text style={styles.paymentButtonText}>Fund {currency} {amount}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />

                                }
                            </View>
                            : null
                        }

                        {(option === "Bank") ?
                            <View>

                                <Text style={{
                                    marginTop: 35, fontWeight: "600"
                                }} >Account Name:</Text>
                                <View style={styles.inputF}>
                                    <MaterialIcons name="account-circle" size={33} color="grey" />
                                    <Text style={styles.textInputF}
                                        onPress={(val) => { }}
                                    >
                                        {user.name}
                                    </Text>
                                </View>

                                <Text style={{
                                    marginTop: 35, fontWeight: "600"
                                }} >Account Number:</Text>
                                <TouchableOpacity onPress={() => {
                                    Clipboard.setString(user.account_number);
                                    Alert.alert("Copied", `You've copied your account number, time to receive money...`)
                                }} style={styles.inputF}>
                                    <FontAwesome5 name="piggy-bank" size={30} color="grey" />
                                    <Text style={styles.textInputF}
                                        onPress={(val) => { }}
                                    >
                                        {user.account_number}
                                    </Text>
                                </TouchableOpacity>

                                <Text style={{
                                    marginTop: 35, fontWeight: "600"
                                }} >Bank:</Text>
                                <View style={styles.inputF}>
                                    <FontAwesome name="bank" size={30} color="grey" />
                                    <Text style={styles.textInputF}
                                        onPress={(val) => { }}
                                    >
                                        {user.bank_name}
                                    </Text>
                                </View>

                            </View> : null
                        }

                    </View>
                </View>
            </ScrollView>
        )
    }


    const amountHandler = (val) => {
        setWAmount(val)
        // if (user.balance >= val) {
        //    setCAmount(true)
        // }
    }

    const acc_numHandler = (val) => {
        setAcc_Num(val)
        if (val.length === 10 && bank.Code) {
            // toast.info("Please wait while we fetch account name")
            axios.post('/appi', {
                "account_number": val,
                "account_bank": bank.Code
            })
                .then(data => {

                    setAcc_Name(data.data.acc_name)

                    if (data.data.message) {
                        Alert.alert("Incorrect details", "Account name could not be fetched")
                    }
                })
                .catch(err => {
                    console.log(err)

                })
        }
    }

    const bankHandler = (val) => {
        setBank(val)
        setBank_Code(val.Code)
        setPage("Send")
        if (acc_num === 10) {
            // toast.info("Please wait while we fetch account name")
            axios.post('/appi', {
                "account_number": acc_num,
                "account_bank": val.Code
            })
                .then(data => {

                    setAcc_Name(data.data.acc_name)

                    if (data.data.message) {
                        Alert.alert("Incorrect details", "Account name could not be fetched")
                    }
                })
                .catch(err => {
                    console.log(err)

                })
        }
    }

    const searchHandler = (val) => {
        setBanks2(abanks.filter(it => it.Name.indexOf(val) !== -1).filter((it) => it.country === "Nigeria"))
    }

    const send = async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)

        let payload = {
            bank_code,
            account_number: acc_num,
            amount: wamount,
            rate: user.rate,
            rate2: user.rate2,
            currency: user.currency,
            userID: id,

        }
        if (payload.amount == 0) {
            return false
        }
        if (payload.amount > user.balance) {
            Alert.alert("Insufficient Balance", `${(user.country === "Nigeria") ? `Comrade, you don't have sufficient balance fotr this transaction!, but you be boss...` : `You don't have sufficient balance fotr this transaction!`}`, [
                (user.country === "Nigeria") ? {
                    text: 'Oppor', onPress: () => {
                        setPage("Fiat")
                    }
                } : {
                    text: 'Ok', onPress: () => {
                        setPage("Fiat")
                    }
                }
            ])
            return false
        }
        setLoading(true)
        axios.post('/withdraw', payload)
            .then(data => {
                if (data.data.id) {
                    console.log("Successfully withdraw from your fiat wallet")
                    axios.post('/user', { userID: id })
                        .then((data) => {
                            setUser(data.data.response)
                            setLoading(false)
                            Alert.alert("Withdrawal Successful", `${(user.country === "Nigeria") ? `Comrade, you get money ooo!, your withdrawal of ${payload.amount} was successful...` : `Your withdrawal of ${payload.amount} was successful`}`, [
                                (user.country === "Nigeria") ? {
                                    text: 'Oppor', onPress: () => {
                                        setPage("Fiat")
                                    }
                                } : {
                                    text: 'Ok', onPress: () => {
                                        setPage("Fiat")
                                    }
                                }
                            ])
                            setWAmount(0)
                            setAcc_Name("")
                            setBank("")
                            setBank_Code("")
                            setAcc_Num("")
                            // setPage("Fiat")
                            console.log({ data: data.data.response })
                            return data.data.response
                        })
                        .catch(err => {
                            console.log({ Error: "Withdrawal error: " + err })
                            setLoading(false)
                            Alert.alert("Withdrawal failed", `${(user.country === "Nigeria") ? `Comrade, your withdrawal of ${payload.amount} didn't go through, but no fear...` : `Your withdrawal of ${payload.amount} didn't go through`}`, [
                                (user.country === "Nigeria") ? {
                                    text: 'ok', onPress: () => {
                                        setPage("Fiat")
                                    }
                                } : {
                                    text: 'Ok', onPress: () => {
                                        setPage("Fiat")
                                    }
                                }
                            ])
                        })
                    // return data
                }

            })

            .catch(err => {
                console.log("Failure to withdraw from your fiat wallet: " + err)
                setLoading(false)
                Alert.alert("Withdrawal failed", `${(user.country === "Nigeria") ? `Comrade, your withdrawal of ${payload.amount} didn't go through, but no fear...` : `Your withdrawal of ${payload.amount} didn't go through`}`, [
                    (user.country === "Nigeria") ? {
                        text: 'ok', onPress: () => {
                            setPage("Fiat")
                        }
                    } : {
                        text: 'Ok', onPress: () => {
                            setPage("Fiat")
                        }
                    }
                ])
            })
    }


    if (page === "Banks") {
        return (
            <View style={styles.wcont}>
                <TouchableOpacity onPress={() => { setPage("Send"); setBank("") }} style={styles.cancel}>
                    <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    style={styles.numsSearch}
                    placeholder="search"
                    onChangeText={(val) => searchHandler(val)}
                // returnKeyType="done"
                />
                <FlatList
                    keyExtractor={(item) => item.Code}
                    data={abanks2}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.txTouch} onPress={() => bankHandler(item)}>

                            <View>
                                <Text style={styles.txText}>{item.Name}</Text>
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    if (page === "Send") {

        return (

            <View style={styles.wcont}>
                <View>

                    <TouchableOpacity onPress={() => setPage("Fiat")} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.withdrawText}>Bank: </Text>
                    <TouchableOpacity onPress={() => setPage("Banks")} style={styles.withdrawView}>

                        <Text style={styles.nums}>{bank.Name}</Text>
                    </TouchableOpacity>

                    <Text style={styles.withdrawText}>Amount (NGN): </Text>
                    {/* <Text style={styles.withdrawText}>Note: 0ur dollar rate is {user.rate2} per $: </Text> */}
                    <View style={styles.withdrawView}>
                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => amountHandler(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>
                    {/* <Text style={styles.getText}>You get: {wamount ? (`${user.currency} ${wamount * user.rate2}`) : null} </Text> */}

                    <Text style={styles.withdrawText}>Account Number: </Text>
                    <View style={styles.withdrawView}>

                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => acc_numHandler(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.withdrawText}>Account Name: </Text>
                    <View style={styles.withdrawView}>

                        <Text style={styles.nums}>{acc_name}</Text>
                    </View>

                    {acc_name !== "" &&
                        <View>
                            <TouchableOpacity
                                style={styles.paymentButton}
                                onPress={() => { send() }}
                            >
                                <Text style={styles.paymentButtonText}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </View >
        )
    }




    const renderInner = () => (
        <View style={styles.panel}>

            <FlatList
                keyExtractor={(item) => item.reference + item.name + item.amount}
                data={user.transactions}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.txTouch} onPress={() => txHandler(item.name)}>

                        {item.name === "Added Funds" && <MaterialIcons name="call-received" size={24} color="#febf12" />}

                        {item.name === "Added Funds With Card" && <Ionicons
                            name="card-outline"
                            size={24}
                            color="#febf12" />}

                        {item.name === "Withdrawal Successful" && <Feather name="send" size={24} color="#febf12" />}

                        {item.name === "Withdrawal Failed" && <MaterialIcons name="cancel" size={24} color="#fd343480" />}

                        {item.name.indexOf("Airtime") != -1 && <Feather name="phone" size={24} color="#febf12" />}

                        {item.name.indexOf("Got") != -1 && <FontAwesome5 name="coins" size={24} color="#febf12" />}

                        {item.name.indexOf("Sent") != -1 && <FontAwesome5 name="coins" size={24} color="#febf12" />}

                        {item.name.indexOf("Exchanged") != -1 && <Entypo name="cycle" size={24} color="#febf12" />}

                        {item.name.indexOf("Bill") != -1 && <FontAwesome5 name="file-alt" size={24} color="#febf12" />}

                        {item.name.indexOf("Pending") != -1 && <MaterialIcons name="pending" size={24} color="#febf12" />}

                        {/* <FontAwesome5 name="money-bill-wave-alt" size={30} color="#febf12" /> */}

                        {/* <Avatar.Image
                            source={{
                                uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                            }}
                            size={50}
                        /> */}
                        <View>
                            <Text style={styles.txText}>{item.name}</Text>
                            <Text style={styles.txTextSub}>{item.amount}</Text>
                        </View>

                    </TouchableOpacity>
                )}
            />
            {/* <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(0)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity> */}
        </View>
    );

    const renderHeader = () => (
        <View style={styles.pheader}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
                <View style={{ alignItems: 'center' }}>
                    {/* <Text style={styles.panelTitle}>Your Transactions</Text> */}
                    <Text style={styles.panelSubtitle}>Transactions</Text>
                </View>
            </View>
        </View>
    );


    if (page === "Fiat") {
        return (
            <View style={{ flex: 1 }}>
                <BottomSheet
                    ref={bs}
                    snapPoints={[500, 230]}
                    renderContent={renderInner}
                    renderHeader={renderHeader}
                    initialSnap={1}
                    callbackNode={fall}
                    enabledGestureInteraction={true}
                />

                <ScrollView style={{ flex: 1 }} refreshControl={
                    <RefreshControl refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            setCleanUp(cleanup + 1)

                        }} />
                }>
                    <View style={styles.container}>

                        <View style={styles.container2}>

                            <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.cancel}>
                                <Text style={styles.name}> Yo, {user.username}</Text>
                            </TouchableOpacity>

                            <View style={styles.header}>
                                <Text style={styles.text_wallet}>Fiat Wallet</Text>
                                <MaterialCommunityIcons name="currency-usd-circle-outline" size={40} color="#febf12" />
                                <Text style={styles.text_header}> &#x20A6; {(user.balance / 1).toString().slice(0, 6)}</Text
                                >
                                <Text style={styles.text_sub_header}> &#x20A6; {(user.ledger_balance / 1).toString().slice(0, 6)}</Text>
                                <View style={styles.buttons}>

                                    <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Fund")}>
                                        <View style={styles.button}>
                                            <MaterialIcons name="add" size={40} color="whitesmoke" />
                                            {/* <Feather name="send" size={24} color="whitesmoke" /> */}
                                        </View>
                                        <Text style={styles.buttonText}>
                                            Add Funds
                                        </Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Send")}>
                                        <View style={styles.button}>

                                            <Feather name="send" size={24} color="whitesmoke" />
                                        </View>
                                        <Text style={styles.buttonText}>
                                            Send Funds
                                        </Text>

                                    </TouchableOpacity>

                                    {/* <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Airtime")}>
                                <View style={styles.button}>

                                    <Feather name="send" size={24} color="whitesmoke" />
                                </View>
                                <Text style={styles.buttonText}>
                                    Airtime
                                </Text>

                            </TouchableOpacity> */}
                                </View>
                            </View>

                            {/* <Text>Fiat Screen!</Text>
                <Button title="Fund" onPress={() => this.props.navigation.goBack()} /> */}
                        </View>
                    </View>
                </ScrollView>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    cancel: {
        top: 0,
        marginBottom: 20,
        marginTop: 10
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 15,
    },
    getText: {
        marginBottom: 10
    },
    numsSearch: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
    },
    name: {
        fontWeight: "bold",
        fontSize: 10
    },
    container: {
        flex: 1,
        // backgroundColor: '#febf1226',
        alignItems: 'center',
        paddingBottom: 100
        // justifyContent: 'center',
    },
    container2: {
        flex: 0.7,
        // backgroundColor: '#febf1226',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    containerInner: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    airContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingLeft: 20,
    },
    airView: {
        marginBottom: 20,
    },
    wcont: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        paddingLeft: 15
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    header: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'space-evenly',
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    text_wallet: {
        fontWeight: '300',
        fontSize: 20,
        paddingBottom: 10,
    },
    text_header: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 30,
        paddingBottom: 10,
        paddingTop: 5
    },
    buttons: {
        marginTop: 35,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: 500
    },
    buttonView: {
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        borderRadius: 50,
        height: 50,
        width: 50,
        backgroundColor: "#febf12",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "whitesmoke",
        borderWidth: 2,
    },
    buttonText: {
        fontWeight: "bold",
        color: "grey"
    },
    panel: {
        padding: 20,
        // backgroundColor: '#febf1226',
        backgroundColor: 'white',
        paddingTop: 20,
        height: 1500,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    pheader: {
        // flex: 1,
        // justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#febf12',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
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
        fontSize: 16,
        color: 'gray',
        height: 30,
        fontWeight: "bold"
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

    // Fund
    option: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#febf12",
        padding: 10,
        borderRadius: 15
    },
    optionText: {
        marginLeft: 5,
        fontWeight: "800"
    },
    input: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "whitesmoke",
        padding: 10,
        borderRadius: 10,
    },
    inputF: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "whitesmoke",
        padding: 10,
        borderRadius: 10,
    },
    textInput: {
        width: "80%",
        marginLeft: 10,
        fontWeight: "bold"
    },
    textInputF: {
        width: "80%",
        marginLeft: 10,
        fontWeight: "bold",
        paddingVertical: 20
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
});

export default Fiat

// <NavigationContainer independent={true}>
        //     <FiatStack.Navigator>
        //         <FiatStack.Screen name="Fiat" component={FiatPage} options={{ headerShown: false }} />

        //         <FiatStack.Screen name="Fund Fiat" component={FundFiat} options={{ headerShown: true }} />

        //         {/* <FiatStack.Screen name="sign-3" component={SignUp3} options={{ headerShown: false }} /> */}

        //     </FiatStack.Navigator>
        // </NavigationContainer>