import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { PayWithFlutterwave } from 'flutterwave-react-native';

function FundFiat({ navigation }) {

    const { signOut } = React.useContext(AuthContext)
    const [isCard, setIsCard] = React.useState(false)
    const [amount, setAmount] = React.useState(0)
    const [currency, setcurrency] = React.useState("NGN")

    const handleOnRedirect = (data) => {
        console.log(data);
    };

    return (
        <View style={styles.container}>

            <View>

                <TouchableOpacity style={styles.option} onPress={() => setIsCard(true)}>
                    <Ionicons
                        name="card-outline"
                        size={44}
                        color="black" />
                    <Text style={styles.optionText}>
                        Fund with bank Card
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
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

export default FundFiat