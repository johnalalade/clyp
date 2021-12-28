import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

function SendCrypto() {
    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState("")

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }

    // Request camera permission
    useEffect(() => {
        askForCameraPermission();
    }, [])

    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setText(data)
        console.log("Type: " + type + "\nData: " + data)
    }

    if (hasPermission === null) {

    }
    if (hasPermission === false) {

    }

    return (
        <View style={styles.container}>
            <View style={styles.barcodebox}>
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: 400, width: 400 }}
                />
                <Text style={styles.maintext}>{text}</Text>
                {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color="tomato" /> }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center"
    },
    barcodebox: {
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: "center",
        height: 300,
        width: 300,
        overflow: "hidden",
        borderRadius: 30,
        backgroundColor: "tomato"
    },
    maintext: {
        fontSize: 16,
        margin: 20
    }
})