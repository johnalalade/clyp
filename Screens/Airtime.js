import React, { useEffect, Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';

function Airtime() {
    const [airAmount, setAirAmount] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [user, setUser] = React.useState()
    const [style, setStyle] = React.useState(styles.nums)
    const [verified, setVerified] = React.useState(false)
    const [asset, setAsset] = React.useState("Fiat")

    const airAmountHandler = (val) => {
        setAirAmount(val)
        if (val < 100 && phone.length === 0) {
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
        if (val.length === 0 && airAmount < 100) {
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
                <TouchableOpacity style={styles.asset} onPress={() => setAsset("Fiat")}>
                    {asset === "Fiat" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>Fiat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => setAsset("BTC")}>
                    {asset === "BTC" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>BTC</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => setAsset("BNB")}>
                    {asset === "BNB" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>BNB</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.asset} onPress={() => setAsset("ETH")}>
                    {asset === "ETH" && <Ionicons name="checkmark" size={24} color="#febf12" />}
                    <Text>ETH</Text>
                </TouchableOpacity>
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