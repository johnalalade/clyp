import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

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

const HomeStackScreen = () => (
  <Tabs.Navigator>

    <Tabs.Screen name="Fiat" component={Fiat} options={{
      tabBarIcon: ({ focused, size }) => (
        <FontAwesome5 name="money-bill-wave" size={size} color={focused ? 'lightblue' : '#ccc'} />
      ),
    }} />

    <Tabs.Screen name="Crypto" component={Crypto} options={{
      tabBarIcon: ({ focused, size }) => (
        <FontAwesome5 name="bitcoin" size={size} color={focused ? 'lightblue' : '#ccc'} />
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

  const [loggedIn, setLoggedIn] = React.useState(false)

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setLoggedIn(true)
      },
      signUp: () => {
        setLoggedIn(true)
      },
      signOut: () => {
        setLoggedIn(false)
      }
    }
  }, [])


  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loggedIn ?

          <Drawer.Navigator >

            <Drawer.Screen name="Profile"  component={Profile} options={{ title: "Profile" }} options={{
              drawerIcon: ({ focused, size }) => (
                  <FontAwesome name="user-circle" size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
