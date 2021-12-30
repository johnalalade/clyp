import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
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

function Settings({ navigation }) {

  const { signOut } = React.useContext(AuthContext)
  const [page, setPage] = React.useState("Settings")
  const [name, setName] = React.useState()
  const [username, setUsername] = React.useState()
  const [phone, setPhone] = React.useState()
  const [user, setUser] = React.useState()

  if (page === "Profile") {
    return (
      <View style={styles.airContainer}>
        <TouchableOpacity onPress={() => setPage("Fiat")} style={styles.cancel}>
          <Feather name="x" size={24} color="black" />
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

        <TouchableOpacity style={styles.options} onPress={() => setPage("Profile")}>
          <View style={styles.optionView}>
            <View style={styles.optionDet}>
              <MaterialIcons name="privacy-tip" size={24} color="black" />
              <Text style={styles.optionText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.options} onPress={() => setPage("Profile")}>
          <View style={styles.optionView}>
            <View style={styles.optionDet}>
              <Entypo name="info-with-circle" size={24} color="black" />
              <Text style={styles.optionText}>About Clyp</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.options} onPress={() => AsyncStorage.clear()}>
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
    marginTop: 10
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
});

export default Settings