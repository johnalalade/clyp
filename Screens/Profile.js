import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useFonts } from "expo-font";

const customFonts = {
    Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Optien: require("../assets/fonts/Optien.ttf"),
    Prompt: require("../assets/fonts/Prompt-ExtraBold.ttf")
  };

function Profile () {
    
    const [isLoaded] = useFonts(customFonts);
    const [name, setName] = React.useState()
    const [username, setUsername] = React.useState()
    const [phone, setPhone] = React.useState()
    const [user, setUser] = React.useState()


        return (
            <View style={styles.container}>
                <Avatar.Image
                    source={{
                        uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                    }}
                    size={50}
                />

                <Text style={styles.airText}>Name: </Text>
                <View style={styles.airView}>
                    <TextInput
                        style={styles.nums}
                        placeholder="100"
                        onChangeText={(val) => setName(val)}
                    />
                </View>

                <Text style={styles.airText}>Username: </Text>
                <View style={styles.airView}>
                    <TextInput
                        style={styles.nums}
                        placeholder="100"
                        onChangeText={(val) => setUsername(val)}
                    />
                </View>

                <Text style={styles.airText}>Phone: </Text>
                <View style={styles.airView}>
                    <TextInput
                        style={styles.nums}
                        placeholder="200"
                        onChangeText={(val) => setPhone(val)}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => { }}
                    >
                        <Text style={styles.profileButtonText}>Update</Text>
                    </TouchableOpacity>
                </View>
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
    nums: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        width: "90%",
        marginBottom: 10,
    },
    profileButton: {
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
    profileButtonText: {
        fontWeight: "800"
    },
});

export default Profile