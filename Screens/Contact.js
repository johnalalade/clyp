import axios from "./axios";
import React, { Component, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function Contact () {
    const [verified, setVerified] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [details, setDetails] = React.useState("")
    const [user, setUser] = React.useState()

    useEffect(async () => {
        let id = await AsyncStorage.getItem('id').then(value => value)
        axios.post('/user', { userID: id })
            .then((data) => {
                setUser(data.data.response)
            })
            .catch(err => {
                console.log({ Err: err })
            })
    }, [])

    const titleHandler = (val) => {
        setTitle(val)
    }
    const detailsHandler = (val) => {
        setDetails(val)
        if(val.length > 0){
            setVerified(true)
        }
        else{
            setVerified(false)
        }
    }

    const submit = () => {
        let request = {
            support: details,
            title: title,
            id: user._id,
            name: user.name
        }
        axios.post('/support', request)
        .then(data => {
            console.log({messsage: data.data.response})
        })
        .catch(err => {
            console.log({messsage: "Unable to send request for support: "+err})
        })
    }


        return (
            <View style={styles.container}>
                <Text style={styles.airText}>How can we help: </Text>
                <View style={styles.airView}>
                    <TextInput
                        style={styles.nums}
                        placeholder="Title"
                        onChangeText={(val) => titleHandler(val)}
                        // returnKeyType="done"
                    />
                </View>

                <Text style={styles.airText}>Explain what you need help with: </Text>
                <View style={styles.airView}>
                    <TextInput
                        style={styles.nums2}
                        placeholder="Message..."
                        onChangeText={(val) => detailsHandler(val)}
                        multiline={true}
                        numberOfLines={4}
                        // keyboardType="numeric"
                        // returnKeyType="done"
                    />
                </View>

                {verified ?
                    <View>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => submit()}
                        >
                            <Text style={styles.contactButtonText}>Send</Text>
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
        backgroundColor: '#febf1226',
        padding: 20,
    },
    airText: {
        fontWeight: "400",
        fontSize: 15
    },
    airView: {
        marginBottom: 20
    },
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
    },
    nums2: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
        height: 100
    },
    contactButton: {
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
    contactButtonText: {
        fontWeight: "800"
    },
});

export default Contact