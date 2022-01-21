import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
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
import Bills from './Screens/Bills';
import Profile from './Screens/Profile';
import axios from './Screens/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const HomeStackScreen = () => (
  <Tabs.Navigator>

    <Tabs.Screen name="Fiat" component={Fiat} options={{
      tabBarIcon: ({ focused, size }) => (
        <FontAwesome5 name="money-bill-wave" size={size} color={focused ? '#febf12' : '#ccc'} />
      ), headerShown: false, tabBarLabelStyle: { color: "#febf12" }
    }} />

    <Tabs.Screen name="Crypto" component={Crypto} options={{
      tabBarIcon: ({ focused, size }) => (
        <FontAwesome5 name="bitcoin" size={size} color={focused ? '#febf12' : '#ccc'} />
      ), headerShown: false, tabBarLabelStyle: { color: "#febf12" }
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
  const [isNew, setisNew] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [cpassword, setCPassword] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [country, setCountry] = React.useState("Nigeria")
  const [currency, setCurrency] = React.useState("NGN")
  const [rate, setRate] = React.useState(480)
  const [rate2, setRate2] = React.useState(500)
  const [code, setCode] = React.useState("NG")
  const [bvn, setBVN] = React.useState("")

  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);


  const authContext =
  {
    signIn: () => {
      let data = {
        username: email,
        password: password,
      }

      console.log(data)
      axios.post('/login', data)
        .then(async (data) => {
          if (data.data.id) {
            await AsyncStorage.setItem('token', data.data.token)
            await AsyncStorage.setItem('id', data.data.id)
            await AsyncStorage.setItem('name', data.data.response.name)
            await AsyncStorage.setItem('username', data.data.response.username)
            await AsyncStorage.setItem('email', data.data.response.email)
            await AsyncStorage.setItem('phone', data.data.response.phone)
            await AsyncStorage.setItem('country', data.data.response.country)
            // await AsyncStorage.setItem('currency', data.data.response.currency)
            // await AsyncStorage.setItem('rate', data.data.response.rate)
            setCountry(data.data.response.country)

            setLoggedIn(true)
          }

          console.log({ data: data.data })
        })
        .catch((err) => {
          console.log({ err })
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
        country: country,
        currency: currency,
        rate: rate,
        rate2: rate2,
        code: code,
        bvn: bvn,
      }

      console.log(data)
      axios.post('/register', data)
        .then(async (data) => {
          await AsyncStorage.setItem('token', data.data.token)
          await AsyncStorage.setItem('id', data.data.id)
          await AsyncStorage.setItem('name', data.data.response.name)
          await AsyncStorage.setItem('username', data.data.response.username)
          await AsyncStorage.setItem('email', data.data.response.email)
          await AsyncStorage.setItem('phone', data.data.response.phone)
          await AsyncStorage.setItem('country', data.data.response.country)
          await AsyncStorage.setItem('currency', data.data.response.currency)
          await AsyncStorage.setItem('rate', data.data.response.rate)

          setLoggedIn(true)
        })
        .catch((err) => {

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
      AsyncStorage.setItem("country", val)
    },
    count: country,
    currency: (val) => {
      setCurrency(val)
    },
    rate: (val) => {
      setRate(val)
    },
    rate2: (val) => {
      setRate2(val)
    },
    code: (val) => {
      setCode(val)
    },
    bvn: (val) => {
      setBVN(val)
    }
  }



  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loggedIn ?

          <Drawer.Navigator screenOptions={{
            drawerItemStyle: {
              backgroundColor: "#febf1226"
            },
            drawerStyle: {
              backgroundColor: "#ffdd7e",
              // width: 240,
            },
            drawerType: 'front',
            drawerActiveTintColor: "white",
          }} >
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

            {(country === "Nigeria" || country === "Ghana") ? <Drawer.Screen name="Buy Airtime" component={Airtime} options={{ title: "Airtime" }} options={{
              drawerIcon: ({ focused, size }) => (
                <Feather
                  name="phone"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} /> : null}

            {(country === "Nigeria") ? <Drawer.Screen name="Pay Bills" component={Bills} options={{ title: "Bills" }} options={{
              drawerIcon: ({ focused, size }) => (
                <AntDesign name="filetext1" size={size}
                color={focused ? 'lightblue' : '#ccc'} />
              )
            }} /> : null}

            <Drawer.Screen name="Settings" component={Settings} options={{
              title: "Settings",
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="settings"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

            <Drawer.Screen name="Contact Us" component={Contact} options={{ title: "Coontact Us" }} options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="chatbubbles-sharp"
                  size={size}
                  color={focused ? 'lightblue' : '#ccc'} />
              )
            }} />

          </Drawer.Navigator>
          :
          (
            !isNew ?
              <AuthStack.Navigator >
            <AuthStack.Screen name="SignIn" component={SignIn} options={{ title: "Clyp" }} />
            <AuthStack.Screen name="SignUp" component={SignUp} options={{ title: "Clyp" }} />
          </AuthStack.Navigator>
          : 
          <div>

          </div>

          )
        }
    </NavigationContainer>
    </AuthContext.Provider >
  )

}

{/* < AuthStack.Navigator >
        <AuthStack.Screen name="SignIn" component={SignIn} options={{ title: "Clyp" }} />
        <AuthStack.Screen name="SignUp" component={SignUp} options={{ title: "Clyp" }} />
      </AuthStack.Navigator> */}

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


// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: { someData: 'goes here' },
//   };

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

{/* <Ionicons name="card-outline" size={24} color="black" /> */ }
{/* <Entypo name="cycle" size={24} color="black" /> */ }
{/* <Feather name="send" size={24} color="black" /> */ }
{/* <FontAwesome name="bank" size={24} color="black" /> */ }