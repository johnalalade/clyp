import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  // Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AuthContext } from './context/AuthContext';

import SignIn from './Screens/Login';
import SignUp from './Screens/Signup';
import Fiat from './Screens/Fiat';
import Crypto from './Screens/Crypto';
import Settings from './Screens/settings';
import Contact from './Screens/Contact';
import Airtime from './Screens/Airtime';
import Profile from './Screens/Profile';
import axios from './Screens/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeStackScreen = () => (
  <Tabs.Navigator>

    <Tabs.Screen name="Fiat" component={Fiat} options={{
      tabBarIcon: ({ focused, size }) => (
        <FontAwesome5 name="money-bill-wave" size={size} color={focused ? '#febf12' : '#ccc'} />
      ), headerShown: false
    }} />

    <Tabs.Screen name="Crypto" component={Crypto} options={{
      tabBarIcon: ({ focused, size }) => (
        <FontAwesome5 name="bitcoin" size={size} color={focused ? '#febf12' : '#ccc'} />
      ),
    }} />

  </Tabs.Navigator>
)


const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="SignIn" component={SignIn} options={{ title: "" }} />
    <AuthStack.Screen name="SignUp" component={SignUp} options={{ title: "" }} />
  </AuthStack.Navigator>
)


const PageStack = createStackNavigator()
const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator()

export default function App() {

  const [loggedIn, setLoggedIn] = React.useState(true)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [cpassword, setCPassword] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [country, setCountry] = React.useState("Nigeria")

  const authContext =
     {
      signIn: () => {
        let data = {
          username: email,
          password: password,
        }

        console.log(data)
        axios.post('/login', data)
        .then((data) => {
          AsyncStorage.setItem('token', data.data.token)
          AsyncStorage.setItem('name', data.data.response.name)
          AsyncStorage.setItem('username', data.data.response.username)
          AsyncStorage.setItem('email', data.data.response.email)
          AsyncStorage.setItem('phone', data.data.response.phone)
          AsyncStorage.setItem('country', data.data.response.country)

          setLoggedIn(true)
        })
        .catch((err) =>{

        })
      },
      signUp: () => {
        // setLoggedIn(true)
        let data = {
          name: name,
          username: username,
          email: email,
          phone: phone,
          password: password,
          country: country
        }

        console.log(data)
        axios.post('/register', data)
        .then((data) => {
          AsyncStorage.setItem('token', data.data.token)
          AsyncStorage.setItem('name', data.data.response.name)
          AsyncStorage.setItem('username', data.data.response.username)
          AsyncStorage.setItem('email', data.data.response.email)
          AsyncStorage.setItem('phone', data.data.response.phone)
          AsyncStorage.setItem('country', data.data.response.country)

          setLoggedIn(true)
        })
        .catch((err) =>{

        })
      },
      signOut: () => {
        AsyncStorage.clear()
        setLoggedIn(false)
      },

      setName,
      setPhone,
      setEmail,
      setPassword,
      setCPassword,
      setUsername,
      setCountry,
      
      name: (val) => {
        setName(val)
        
      },
      phone: (val) => {
        setPhone(val)
      },
      email: (val) => {
        setEmail(val)
      },
      password: (val) => {
        setPassword(val)
      },
      cpassword: (val) => {
        setCPassword(val)
      },
      username: (val) => {
        setUsername(val)
      },
      country: (val) => {
        setCountry(val)
      }
    }
  


  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loggedIn ?

          <Drawer.Navigator >
            {/* <View style={styles.drawerContent}>
              <View style={styles.userInfoSection}>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <Avatar.Image
                    source={{
                      uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                    }}
                    size={50}
                  />
                  <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                    <Title style={styles.title}>John Doe</Title>
                    <Caption style={styles.caption}>@j_doe</Caption>
                  </View>
                </View>
              </View>
            </View> */}

            {/* <Drawer.Screen name="Profile" component={Profile} options={{ title: "Profile" }} options={{
              drawerIcon: ({ focused, size }) => (
                <FontAwesome name="user-circle" size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} /> */}

            <Drawer.Screen name="Home" component={HomeStackScreen} options={{ title: "Home" }} options={{
              drawerIcon: ({ focused, size }) => (
                <AntDesign
                  name="home"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

            <Drawer.Screen name="Buy Airtime" component={Airtime} options={{ title: "Settings" }} options={{
              drawerIcon: ({ focused, size }) => (
                <Feather
                  name="phone"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

            <Drawer.Screen name="Settings" component={Settings} options={{ title: "Settings" }} options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="settings"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

            <Drawer.Screen name="Contact Us" component={Contact} options={{ title: "Settings" }} options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="chatbubbles-sharp"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

          </Drawer.Navigator>
          :
          <AuthStack.Navigator>
            <AuthStack.Screen name="SignIn" component={SignIn} options={{ title: "Clyp" }} />
            <AuthStack.Screen name="SignUp" component={SignUp} options={{ title: "Clyp" }} />
          </AuthStack.Navigator>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  }
});
{/* <Ionicons name="card-outline" size={24} color="black" /> */ }
{/* <Entypo name="cycle" size={24} color="black" /> */ }
{/* <Feather name="send" size={24} color="black" /> */ }
{/* <FontAwesome name="bank" size={24} color="black" /> */ }