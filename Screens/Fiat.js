import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { FlatList } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FiatPage from "./Fiat-Page";
import FundFiat from "./Fund-Fiat";
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import banks from "./available_banks";
import { UserInterfaceIdiom } from "expo-constants";
import axios from './axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const FiatStack = createStackNavigator()

function Fiat({ navigation }) {


    const [isCard, setIsCard] = React.useState(false)
    const [amount, setAmount] = React.useState(0)
    const [currency, setcurrency] = React.useState("NGN")
    const [page, setPage] = React.useState("Fiat")

    const [user, setUser] = React.useState({})

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

    const airAmountHandler = (val) => {
        setAirAmount(val)
        if (val < 100) {
            setStyle(styles.error)
            setVerified(false)
        }
        // if(val > user.balance){
        //     setStyle(styles.error)
        // }
        else {
            setVerified(true)
            setStyle(styles.nums)
        }
    }
    const airphoneHandler = (val) => {
        setPhone(val)
    }

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
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)

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

            })

    }, [])


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
                    }
                    return data
                })
                .then(res => {
                    axios.post('/user', { userID: id })
                        .then((data) => {
                            setUser(data.data.response)
                            setPage("Fiat")
                            console.log({ data: data.data.response })
                            return data.data.response
                        })
                        .catch(err => {

                        })
                })
                .catch(err => {
                    console.log("Failure to funded your fiat wallet: " + err)
                })
        }
    };

    if (page === "Airtime") {
        return (
            <View style={styles.airContainer}>

                <View>
                    <TouchableOpacity onPress={() => setPage("Fiat")} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

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

                    {verified ?
                        <View>
                            <TouchableOpacity
                                style={styles.paymentButton}
                                onPress={() => { }}
                            >
                                <Text style={styles.paymentButtonText}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                </View>
            </View>

        )
    }

    if (page === "Fund") {
        return (
            <View style={styles.container}>

                <View>
                    <TouchableOpacity onPress={() => setPage("Fiat")} style={styles.cancel}>
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={() => setIsCard(true)}>
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

                    {isCard &&
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
                                    onChangeText={(val) => setAmount(val)}
                                />
                            </View>
                            {amount >= 100 &&
                                <PayWithFlutterwave
                                    onRedirect={handleOnRedirect}
                                    options={{
                                        tx_ref: "XXXXXXXXX",
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

                    }

                </View>

            </View>
        )
    }


    const amountHandler = (val) => {
        if (user.balance >= 100) {
            if (user.balance >= val) {
                setWAmount(val)
                setCAmount(true)
            }
            else {
                // More than available balance
            }
        }
        else {
            // insufficient Balance
        }
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
                    // this.setState({
                    //   acc_name: data.data.acc_name.slice(0,data.data.acc_name.indexOf('"')),
                    //   c_name: true
                    // })
                    setAcc_Name(data.data.acc_name.slice(0, data.data.acc_name.indexOf('"')))

                    if (data.data.acc_name.slice(0, data.data.acc_name.indexOf('"')).length === 0) {
                        //   toast.warning('Incorrect details, please check and try again...')
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
                    // this.setState({
                    //   acc_name: data.data.acc_name.slice(0,data.data.acc_name.indexOf('"')),
                    //   c_name: true
                    // })
                    setAcc_Name(data.data.acc_name.slice(0, data.data.acc_name.indexOf('"')))

                    if (data.data.acc_name.slice(0, data.data.acc_name.indexOf('"')).length === 0) {
                        //   toast.warning('Incorrect details, please check and try again...')
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
            currency: user.currency,
            userID: id,

        }
        axios.post('/withdraw', payload)
            .then(data => {
                if (data.data.id) {
                    console.log("Successfully withdraw from your fiat wallet")
                }
                return data
            })
            .then(res => {
                axios.post('/user', { userID: id })
                    .then((data) => {
                        setUser(data.data.response)
                        setPage("Fiat")
                        console.log({ data: data.data.response })
                        return data.data.response
                    })
                    .catch(err => {

                    })
            })
            .catch(err => {
                console.log("Failure to withdraw from your fiat wallet: " + err)
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

                    <Text style={styles.withdrawText}>Amount: </Text>
                    <View style={styles.withdrawView}>
                        <TextInput
                            style={styles.nums}
                            placeholder="200"
                            onChangeText={(val) => amountHandler(val)}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

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

                    {acc_name !== "" && camount &&
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
                keyExtractor={(item) => item.reference}
                data={user.transactions}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.txTouch} onPress={() => txHandler(item.name)}>
                        <Avatar.Image
                            source={{
                                uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                            }}
                            size={50}
                        />
                        <View>
                            <Text style={styles.txText}>{item.name}</Text>
                            <Text style={styles.txTextSub}>{item.name}</Text>
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

            <View style={styles.container}>

                <BottomSheet
                    ref={bs}
                    snapPoints={[500, 130]}
                    renderContent={renderInner}
                    renderHeader={renderHeader}
                    initialSnap={1}
                    callbackNode={fall}
                    enabledGestureInteraction={true}
                />

                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.text_wallet}>Fiat Wallet</Text>
                        <Text style={styles.text_header}>${user.balance}</Text>
                        <View style={styles.buttons}>

                            <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Fund")}>
                                <View style={styles.button}>

                                    <Feather name="send" size={24} color="whitesmoke" />
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
        marginBottom: 10,
    },
    numsSearch: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#febf1226',
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
        paddingBottom: 50
    },
    text_wallet: {
        fontWeight: '300',
        fontSize: 20
    },
    text_header: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 30
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: 500
    },
    buttonView: {
        alignItems: "center"
    },
    button: {
        borderRadius: 50,
        height: 60,
        width: 60,
        backgroundColor: "#febf12",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontWeight: "bold",
        color: "grey"
    },
    panel: {
        padding: 20,
        backgroundColor: '#febf1226',
        paddingTop: 20,
        height: 1000,
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
        marginBottom: 12
    },
    txText: {
        marginLeft: 5,
        fontWeight: "700"
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
    textInput: {
        width: "80%",
        marginLeft: 10,
        fontWeight: "bold"
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