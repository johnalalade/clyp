import React, { Component } from "react";
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

const FiatStack = createStackNavigator()

function Fiat() {


    const [isCard, setIsCard] = React.useState(false)
    const [amount, setAmount] = React.useState(0)
    const [currency, setcurrency] = React.useState("NGN")
    const [page, setPage] = React.useState("Fiat")

    const handleOnRedirect = (data) => {
        console.log(data);
    };

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

    const renderInner = () => (
        <View style={styles.panel}>

            <FlatList
                keyExtractor={(item) => item.reference}
                data={txs}
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

    let bs = React.createRef();
    let fall = new Animated.Value(1);

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
                            color="black" />
                        <Text style={styles.optionText}>
                            Fund with bank Card
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={() => na}>
                        <Entypo
                            name="cycle"
                            size={44}
                            color="black" />
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
                                    color="black" />
                                <TextInput
                                    placeholder="Amount"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    keyboardType="numeric"
                                    enablesReturnKeyAutomatically
                                    onChangeText={(val) => setAmount(val)}
                                />
                            </View>
                            {amount <= 100 &&
                                <PayWithFlutterwave
                                    onRedirect={handleOnRedirect}
                                    options={{
                                        tx_ref: "XXXXXXXXX",
                                        authorization: 'FLWPUBK-b73d166127557d9fc24d219eb9ac96e2-X',
                                        customer: {
                                            email: 'customer-email@example.com'
                                        },
                                        amount: amount,
                                        currency: "GBP",
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

    if (page === "Send") {

    }

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
                        <Text style={styles.text_header}>$100.00</Text>
                        <View style={styles.buttons}>

                            <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Fund")}>
                                <View style={styles.button}>

                                    <Feather name="send" size={24} color="black" />
                                </View>
                                <Text style={styles.buttonText}>
                                    Add Funds
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonView}>
                                <View style={styles.button}>

                                    <Feather name="send" size={24} color="black" />
                                </View>
                                <Text style={styles.buttonText}>
                                    Send Funds
                                </Text>

                            </TouchableOpacity>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    containerInner: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
        color: 'black',
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
        backgroundColor: "#ff37374f",
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
        backgroundColor: '#FFFFFF',
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
        paddingBottom: 5,
        backgroundColor: '#FFFFFF'
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
        backgroundColor: "#caca05",
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
        backgroundColor: "#caca05",
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