import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { FlatList } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";


function FiatPage({ navigation }) {

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

                        <TouchableOpacity style={styles.buttonView} onPress={() => navigation.push("Fund Fiat")}>
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

                <Text>Fiat Screen!</Text>
                <Button title="Fund" onPress={() => this.props.navigation.goBack()} />
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
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
});

export default FiatPage