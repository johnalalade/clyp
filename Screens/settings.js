import React, { Component, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axios';
import Hyperlink from 'react-native-hyperlink';
import { useFonts } from "expo-font";
import { FontAwesome5 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const customFonts = {
  Nunito: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
  Optien: require("../assets/fonts/Optien.ttf"),
  Prompt: require("../assets/fonts/Prompt-ExtraBold.ttf")
};

function Settings({ navigation }) {

  const { signOut } = React.useContext(AuthContext)

  const [isLoaded] = useFonts(customFonts);
  const [page, setPage] = React.useState("Settings")
  const [name, setName] = React.useState()
  const [username, setUsername] = React.useState()
  const [phone, setPhone] = React.useState()
  const [user, setUser] = React.useState()

  useEffect(async () => {
    let id = await AsyncStorage.getItem('id').then(value => value)
    axios.post('/user', { userID: id })
      .then((data) => {
        setUser(data.data.response)
        setName(data.data.response.name)
        setUsername(data.data.response.username)
        setPhone(data.data.response.phone)
        console.log({ data: data.data.response })
        return data.data.response
      })
      .catch(err => {
        console.log({ Err: err })
      })
  }, [])

  const submit = async () => {
    let id = await AsyncStorage.getItem('id').then(value => value)

    let payload = {
      name: name,
      username: username,
      phone: phone,
      userID: id
    }

    if (payload.name === "" || payload.username === "" || payload.phone === "") {
      console.log({ Nope: "All field is required" })
      return false
    }
    else {
      axios.post('/update', payload)
        .then(data => {
          console.log(data.data.response)
          setPage("Settings")
        })
    }
  }

  if (page === "Profile") {
    return (
      <View style={styles.airContainer}>
        <TouchableOpacity onPress={() => setPage("Settings")} style={styles.cancel}>
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Avatar.Image
            source={{
              uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
            }}
            size={50}
          />
        </View>

        <Text style={styles.airText}>Name: </Text>
        <View style={styles.airView}>
          <TextInput
            style={styles.nums}
            placeholder="100"
            onChangeText={(val) => setName(val)}
            defaultValue={name}
          />
        </View>

        <Text style={styles.airText}>Username: </Text>
        <View style={styles.airView}>
          <TextInput
            style={styles.nums}
            placeholder="100"
            onChangeText={(val) => setUsername(val)}
            defaultValue={username}
          />
        </View>

        <Text style={styles.airText}>Phone: </Text>
        <View style={styles.airView}>
          <TextInput
            style={styles.nums}
            placeholder="200"
            onChangeText={(val) => setPhone(val)}
            defaultValue={phone}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        <View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => { submit() }}
          >
            <Text style={styles.profileButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (page === "Ref") {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => setPage("Settings")} style={styles.cancel}>
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>

        {user && <View style={styles.refView}>

          <Text style={styles.refDet}>Let your referrals login with your Clyp ID below</Text>
          <TouchableOpacity style={styles.refCont} onPress={() => {
            Clipboard.setString(user.clypID);
            Alert.alert("Copied", `${(user.country === "Nigeria") ? `Comrade, you've copied your Clyp ID, time to reffer...` : `Your Clyp ID has been copied Successfully`}`,)
          }}>
            <Text style={styles.id}>{user.clypID}</Text>
          </TouchableOpacity>
          <Text style={styles.refText}>You receive 1 Tron for every person that signs up with your Clyp ID 😜</Text>
          <View>
            <Text>Your Referrals: 0</Text>
          </View>
        </View>
        }
      </View>
    )
  }

  return (
    <View style={styles.cont}>
      <View style={styles.container}>
        {/* <View> */}
        <TouchableOpacity style={styles.options} onPress={() => setPage("Profile")}>
          <View style={styles.optionView}>
            <View style={styles.optionDet}>

              <EvilIcons name="user" size={30} color="black" />
              <Text style={styles.optionText}>Profile</Text>

            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.options} onPress={() => setPage("Ref")}>
          <View style={styles.optionView}>
            <View style={styles.optionDet}>

              <FontAwesome5 name="people-arrows" size={30} color="black" />
              <Text style={styles.optionText}>Referrals</Text>

            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <Hyperlink linkDefault={true} linkStyle={{ backgroundColor: null }} linkText="Privacy Policy" >
          <View style={styles.options}>
            <View style={styles.optionView}>
              <View style={styles.optionDet}>
                <MaterialIcons name="privacy-tip" size={24} color="black" />
                <Text style={styles.optionText}>https://www.clypapp.com/privacy.html</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="black" />
            </View>
          </View>
        </Hyperlink>


        <Hyperlink linkStyle={{ backgroundColor: null }} linkDefault={true} linkText="About Clyp">
          <View style={styles.options}>
            <View style={styles.optionView}>
              <View style={styles.optionDet}>
                <Entypo name="info-with-circle" size={24} color="black" />
                <Text style={styles.optionText}>https://www.clypapp.com/</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="black" />
            </View>
          </View>
        </Hyperlink>

        <TouchableOpacity style={styles.options} onPress={() => signOut()}>
          <View style={styles.optionView}>
            <View style={styles.optionDet}>
              <AntDesign name="logout" size={24} color="black" />
              <Text style={styles.optionText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>
        {/* </View> */}
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 0.7,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20
  },
  cancel: {
    top: 0,
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 10,
  },
  avatar: {
    marginVertical: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: 'center'
  },
  airContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 20,
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
  profileButton: {
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
  profileButtonText: {
    fontWeight: "800",
  },
  options: {
    padding: 20,
    width: 300,
    backgroundColor: "#febf124d",
    borderRadius: 10
  },
  optionView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  optionDet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  optionText: {
    marginLeft: 5,
    fontWeight: "700"
  },
  refView: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  refDet: {
    fontWeight: "600",
    fontSize: 15
  },
  refCont: {
    borderRadius: 10,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#febf12",
    padding: 20
  },
  id: {
    color: "#febf12",
    fontWeight: "700",
    fontSize: 20,
  },
  refText: {
    fontWeight: "500",
    textAlign: "center"
  },
});

export default Settings