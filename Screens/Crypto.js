import React, { useState, useEffect, Component, } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView, Image, RefreshControl, Alert } from "react-native";
import { Feather } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
// import QRCode from 'react-native-qrcode-svg';
import { Avatar, Snackbar } from "react-native-paper";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import axios from "./axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { ActivityIndicator } from "react-native-paper";


function Crypto() {

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [text, setText] = useState("")
  const [page, setPage] = React.useState("Fiat")
  const [verifiedSell, setVerifiedSell] = React.useState(false)
  const [verifiedBuy, setVerifiedBuy] = React.useState(false)
  const [verifiedSend, setVerifiedSend] = React.useState(false)
  const [style, setStyle] = React.useState(styles.address)
  const [loading, setLoading] = React.useState(false)

  const [images, setImage] = React.useState([
    require('../assets/bitcoin.png'), require('../assets/binance.png'), require('../assets/ethereum.png'), require('../assets/tether.png')
  ])
  const [ix, setIx] = React.useState(0)

  const [cleanup, setCleanUp] = React.useState(0)
  const [refreshing, setRefreshing] = React.useState(false)

  const [qr, setQR] = useState(null)
  const [rAddress, setRAddress] = React.useState("")
  const [rAmount, setRAmount] = React.useState(0)
  // const [address, setAddress] = React.useState("")
  const [pKey, setPkey] = React.useState("")
  const [btc, setBTC] = React.useState()
  const [bnb, setBNB] = React.useState()
  const [eth, setETH] = React.useState()
  const [usdt, setUSDT] = React.useState()
  const [user, setUser] = React.useState()



  const [address, setAddress0] = React.useState({
    name: "Bitcoin",
    privateKey: "xxxxxxxxxxxxxxxxxxxxxx",
    address: "xxxxxxxxxxxxxxxxxxxxxxxx",
    image: ""
  })
  // const [cryptos, setCryptos] = useState([
  //   {
  //     name: "BTC",
  //     privateKey: "1xr4sx6tvs6rey86rrfsj767t7kh",
  //     address: "1xr4sx6tvs6rey86rrfsj767t7kh",
  //     image: "",
  //     amount: btc / 1957
  //   },
  //   {
  //     name: "BNB",
  //     privateKey: "1BNBxr4sx6tvs6rey86rrfsj767t7kh",
  //     address: "1BNBxr4sx6tvs6rey86rrfsj767t7kh",
  //     image: ""
  //   },
  //   {
  //     name: "ETH",
  //     privateKey: "1ETHxr4sx6tvs6rey86rrfsj767t7kh",
  //     address: "1ETHxr4sx6tvs6rey86rrfsj767t7kh",
  //     image: ""
  //   }
  // ])

  const [amount, setAmount] = useState("")

  // Request camera permission
  useEffect(async () => {
    let id = await AsyncStorage.getItem('id').then(value => value)
    axios.post('/user', { userID: id })
      .then((data) => {
        setUser(data.data.response)
        setAddress0(data.data.response.wallets[0])
        console.log({ data: data.data.response })
        return data.data.response
      })
      .then(user => {
        axios.post('/cryptobalance2', { asset: "BTC", address: user.wallets[0].address })
          .then((data) => {
            setBTC(data.data.balance)
            console.log(data.data.balance)
          })
          .catch((err) => {
            console.log({ Err: "Unable to get BTC balance " + err })
          })

        axios.post('/cryptobalance2', { asset: "BNB", address: user.wallets[1].address })
          .then((data) => {
            setBNB(data.data.balance)
            console.log(data.data.balance)
          })
          .catch((err) => {
            console.log({ Err: "Unable to get BNB balance " + err })
          })

        axios.post('/cryptobalance2', { asset: "ETH", address: user.wallets[2].address })
          .then((data) => {
            setETH(data.data.balance)
            // setRefreshing(false)
            console.log(data.data.balance)
          })
          .catch((err) => {
            console.log({ Err: "Unable to get ETH balance " + err })
          })

        axios.post('/cryptobalance2', { asset: "USDT", address: user.wallets[3].address })
          .then((data) => {
            setUSDT(data.data.balance)
            setRefreshing(false)
            console.log(data.data.balance)
          })
          .catch((err) => {
            console.log({ Err: "Unable to get USDT balance " + err })
          })
      })
      .catch(err => {
        console.log({ Err: err })
        setRefreshing(false)
      })

    askForCameraPermission();
  }, [cleanup])

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    setPage("Send")
    setRAddress(data)
    console.log("Type: " + type + "\nData: " + data)
  }

  // Amounts

  const amountHandler = (val) => {
    setAmount(parseInt(val) - ((2 / 100) * val))
    let value = parseInt(val) - ((2 / 100) * val)

    if (address.name === "BTC") {
      let balance = btc / 1957

      if (val > balance) {
        setStyle(styles.error)
        setVerifiedSell(false)
      }
    }
    else if (address.name === "BNB") {
      let balance = bnb / 242205133645110.0000


      if (val > balance) {
        setStyle(styles.error)
        setVerifiedSell(false)
      }
    }
    else if (address.name === "ETH") {
      let balance = eth / 242205133645110.0000

      if (val > balance) {
        setStyle(styles.error)
        setVerifiedSell(false)
      }
    }
    else {
      setVerifiedSell(true)
    }
  }

  const amountHandlerBuy = (val) => {
    setAmount(parseInt(val) - ((2 / 100) * val))
    let value = parseInt(val) - ((2 / 100) * val)

    if (address.name === "BTC") {
      let balance = btc / 1957

      if (val > user.balance / user.rate) {
        setStyle(styles.error)
        setVerifiedBuy(false)
      }
    }
    else if (address.name === "BNB") {
      let balance = bnb / 242205133645110.0000


      if (val > user.balance / user.rate) {
        setStyle(styles.error)
        setVerifiedBuy(false)
      }
    }
    else if (address.name === "ETH") {
      let balance = eth / 242205133645110.0000

      if (val > user.balance / user.rate) {
        setStyle(styles.error)
        setVerifiedBuy(false)
      }
    }
    else {
      setVerifiedBuy(true)
    }
  }

  const toHexadecimal = (number) => {
    var result = [], i;
    for (i = number; i > 0; i = parseInt(i / 16)) {
      result.push(i % 16);
    }

    for (i = 0; i < result.length; i++) {
      switch (result[i]) {
        case 10:
          result[i] = "A";
          break;

        case 11:
          result[i] = "B";
          break;

        case 12:
          result[i] = "C";
          break;

        case 13:
          result[i] = "D";
          break;

        case 14:
          result[i] = "E";
          break;

        case 15:
          result[i] = "F";
          break;
      }
    }
    return result.reverse().join("");
  }

  const sendamount = (val) => {
    console.log(Number(val))

    setRAmount(Number(val))

    if (address.name === "BTC") {
      let balance = btc

      if (val > balance) {
        setStyle(styles.error)
        setVerifiedSend(false)
      }
      else {
        // setRAmount(Number(val))
        setVerifiedSend(true)
      }
    }
    else if (address.name === "BNB") {
      let balance = bnb


      if (val > balance) {
        setStyle(styles.error)
        setVerifiedSend(false)
      }
      else {
        setVerifiedSend(true)
      }
    }
    else if (address.name === "ETH") {
      let balance = eth

      if (val > balance) {
        setStyle(styles.error)
        setVerifiedSend(false)
      }
      else {
        setVerifiedSend(true)
      }
    }
    else {
      setVerifiedSend(true)
    }
  }

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }

  // submits
  const send = () => {
    let payload = {
      address: address.address,
      private_key: address.privateKey,
      receiver: rAddress,
      asset: address.name,
      amount: rAmount,
      userID: user._id
    }
    setLoading(true)

    axios.post('/sendcrypto', payload)
      .then(data => {
        if (data.data.id) {
          console.log({ Mymessage: `Sent NGN` + + payload.amount + " " + payload.asset })
          console.log({ message: data.data.message })
          setLoading(false)
          Alert.alert(`${payload.asset} sent successfully`, `${(user.country === "Nigeria") ? `Comrade, you get money ooo!, you've successfully sent NGN ${payload.amount} ${payload.asset}...` : `You've successfully sent NGN ${payload.amount} ${payload.asset}...`}`, [
            (user.country === "Nigeria") ? {
              text: 'Oppor', onPress: () => {
                setPage("Crypto")
              }
            } : {
              text: 'Ok', onPress: () => {
                setPage("Crypto")
              }
            }
          ])
        }
        else {
          setLoading(false)
          Alert.alert(`${payload.asset} transaction failed`, `${(user.country === "Nigeria") ? `Comrade, your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...` : `Your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...`}`, [
            (user.country === "Nigeria") ? {
              text: 'Alright', onPress: () => {
                setPage("Crypto")
              }
            } : {
              text: 'Ok', onPress: () => {
                setPage("Crypto")
              }
            }
          ])
          console.log({ othermessage: data.data.message })
        }


      })
      .catch(err => {
        setLoading(false)
        Alert.alert(`${payload.asset} transaction failed`, `${(user.country === "Nigeria") ? `Comrade, your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...` : `Your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...`}`, [
          (user.country === "Nigeria") ? {
            text: 'Alright', onPress: () => {
              setPage("Crypto")
            }
          } : {
            text: 'Ok', onPress: () => {
              setPage("Crypto")
            }
          }
        ])
        console.log({ message: "Error " + err })
      })
  }

  const sell = () => {
    let payload = {
      address: address.address,
      private_key: address.privateKey,
      asset: address.name,
      amount: amount,
      userID: user._id
    }
    setLoading(true)

    axios.post('/sellcrypto', payload)
      .then(data => {
        if (data.data.id) {
          console.log({ Mymessage: "Sold $" + payload.amount + " " + payload.asset })
          console.log({ message: data.data.message })
          setLoading(false)
          Alert.alert(`${payload.asset} sent successfully`, `${(user.country === "Nigeria") ? `Comrade, you get money ooo!, you've successfully converted NGN ${payload.amount} ${payload.asset} to fiat...` : `You've successfully converted NGN ${payload.amount} ${payload.asset} to fiat...`}`, [
            (user.country === "Nigeria") ? {
              text: 'Oppor', onPress: () => {
                setPage("Crypto")
              }
            } : {
              text: 'Ok', onPress: () => {
                setPage("Crypto")
              }
            }
          ])
        }
        else {
          setLoading(false)
          Alert.alert(`${payload.asset} transaction failed`, `${(user.country === "Nigeria") ? `Comrade, your transaction of NGN${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...` : `Your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...`}`, [
            (user.country === "Nigeria") ? {
              text: 'Alright', onPress: () => {
                setPage("Crypto")
              }
            } : {
              text: 'Ok', onPress: () => {
                setPage("Crypto")
              }
            }
          ])
          console.log({ othermessage: data.data.message })
        }

      })
      .catch(err => {
        setLoading(false)
        Alert.alert(`${payload.asset} transaction failed`, `${(user.country === "Nigeria") ? `Comrade, your transaction of NGN${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...` : `Your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...`}`, [
          (user.country === "Nigeria") ? {
            text: 'Alright', onPress: () => {
              setPage("Crypto")
            }
          } : {
            text: 'Ok', onPress: () => {
              setPage("Crypto")
            }
          }
        ])
        console.log({ message: "Error " + err })
      })
  }

  const buy = () => {
    let payload = {
      address: address.address,
      private_key: address.privateKey,
      asset: address.name,
      amount: amount,
      userID: user._id
    }
    setLoading(true)

    axios.post('/buycrypto', payload)
      .then(data => {
        if (data.data.id) {
          console.log({ Mymessage: "Bought NGN" + payload.amount + " " + payload.asset })
          console.log({ message: data.data.message })
          setLoading(false)
          Alert.alert(`${payload.asset} sent successfully`, `${(user.country === "Nigeria") ? `Comrade, you get money ooo!, you've successfully converted your fiat balance to NGN ${payload.amount} ${payload.asset}...` : `You've successfully converted your fiat balance to NGN${payload.amount} ${payload.asset} to fiat...`}`, [
            (user.country === "Nigeria") ? {
              text: 'Oppor', onPress: () => {
                setPage("Crypto")
              }
            } : {
              text: 'Ok', onPress: () => {
                setPage("Crypto")
              }
            }
          ])
        }
        else {
          setLoading(false)
          Alert.alert(`${payload.asset} transaction failed`, `${(user.country === "Nigeria") ? `Comrade, your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...` : `Your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...`}`, [
            (user.country === "Nigeria") ? {
              text: 'Alright', onPress: () => {
                setPage("Crypto")
              }
            } : {
              text: 'Ok', onPress: () => {
                setPage("Crypto")
              }
            }
          ])
          console.log({ othermessage: data.data.message })
        }

      })
      .catch(err => {
        setLoading(false)
        Alert.alert(`${payload.asset} transaction failed`, `${(user.country === "Nigeria") ? `Comrade, your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...` : `Your transaction of NGN ${payload.amount} ${payload.asset} failed please make sure you have enough ${payload.asset} to cover network fees, and try again...`}`, [
          (user.country === "Nigeria") ? {
            text: 'Alright', onPress: () => {
              setPage("Crypto")
            }
          } : {
            text: 'Ok', onPress: () => {
              setPage("Crypto")
            }
          }
        ])
        console.log({ message: "Error " + err })
      })
  }


  if (loading) {
    return (
      <View style={{ opacity: 0.5, flex: 1, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#febf12" />
      </View>
    )
  }



  if (page === "Scan") {
    if (page === "Scan" && hasPermission === null) {

    }
    if (page === "Scan" && hasPermission === false) {

    }
    return (
      <View>
        {/* <TouchableOpacity onPress={() => setPage(null)} style={styles.cancel}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity> */}

        <View style={styles.container}>
          <View style={styles.barcodebox}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }}
            />
            <View style={styles.codeSubs}>
              <Text style={styles.maintext}>{text}</Text>
              {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} />}

              <Button title="Cancel" onPress={() => setPage("Send")} color="red" />
            </View>

          </View>
        </View>
      </View>
    )
  }

  if (page === "Send") {
    return (
      <View style={styles.containerSend}>

        <TouchableOpacity onPress={() => setPage(null)} style={styles.cancel}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>

        <View>
          <Text style={styles.convertTop}>Send {address.name}</Text>
          <Text style={styles.addressText}>{address.name} Address:</Text>
          <View style={styles.addressInput}>
            <TextInput
              style={styles.address}
              placeholder={address.address}
              defaultValue={rAddress}
              onChangeText={(val) => setRAddress(val)}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setPage("Scan")}>
              <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.addressText}>Amount</Text>
          <View style={styles.addressInput}>
            <Foundation name="dollar" size={30} color="black" />
            <TextInput
              style={styles.address}
              placeholder={address.address}
              onChangeText={(val) => sendamount(val)}
              keyboardType="numeric"
              returnKeyType="done"

            />
          </View>

        </View>
        {verifiedSend ?
          <TouchableOpacity style={styles.sendBtn} onPress={() => { send() }}>
            <Text style={styles.sendText}> Send </Text>
            <Feather name="send" size={20} color="whitesmoke" />
          </TouchableOpacity>
          :
          null
        }
      </View>
    )
  }

  if (page === "Receive") {
    return (
      <View style={styles.containerSend}>

        <TouchableOpacity onPress={() => setPage(null)} style={styles.cancel}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.qrView} >

          <Text style={styles.qrtext}>Click to copy or scan QR code to get your {address.name} address </Text>

          {/* <Image source={require('../assets/bitcoin.png')} style={{ width: 400, height: 400 }} /> */}
          <TouchableOpacity style={styles.codes} onPress={() => {
            Clipboard.setString(address.address);
            Alert.alert("Copied", `${(user.country === "Nigeria") ? `Comrade, you've copied your ${address.name} address...` : `Your ${address.name} address has been copied Successfully`}`,)
          }}>
            <QRCode value={address.address} size={200} />

            <TouchableOpacity style={styles.cryptoAddressTouch} onPress={() => {
              Clipboard.setString(address.address);
              Alert.alert("Copied", `${(user.country === "Nigeria") ? `Comrade, you've copied your ${address.name} address...` : `Your ${address.name} address has been copied Successfully`}`,)
            }} >

              {/* <CustomQRCode
              codeStyle="circle"
              linearGradient={['green', 'red']}
              content="QR code with circles"
            /> */}
              <Text style={styles.cryptoAddress}>
                {address.address}
              </Text>
              <AntDesign name="qrcode" size={24} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>

          <Text style={styles.qrtext2}>Send only {address.name} to this address </Text>
        </View>
      </View>
    )
  }

  if (page === "Buy") {
    return (
      <View style={styles.containerSend}>

        <TouchableOpacity onPress={() => setPage(null)} style={styles.cancel}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>

        <View>
          <Text style={styles.convertTop}>Convert Fiat to {address.name}</Text>

          <Text style={styles.convertPrice}>Amount of Fiat in NGN you want to convert to {address.name}</Text>
          <Text style={styles.minimum}>Minimum amount &#x20A6; 500</Text>
          <View style={styles.addressInput}>
            <Foundation name="dollar" size={30} color="black" />
            <TextInput
              style={styles.address}
              placeholder="200"
              onChangeText={(val) => amountHandlerBuy(val)}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <Text style={styles.processing}>Processing fee ~ 2%</Text>

          <Text style={styles.addressText}>Your {address.name} wallet will be credited with: </Text>
          <View style={styles.addressInput}>
            <Foundation name="dollar" size={30} color="black" />

            <Text style={styles.address}>{amount}</Text>
          </View>

        </View>
        {verifiedBuy ?
          <TouchableOpacity style={styles.sendBtn} onPress={() => { buy() }}>
            <Text style={styles.sendText}> Convert To {address.name} </Text>
            <Feather name="send" size={20} color="whitesmoke" />
          </TouchableOpacity>
          :
          null
        }
      </View>
    )
  }

  if (page === "Sell") {
    return (
      <View style={styles.containerSend}>

        <TouchableOpacity onPress={() => setPage(null)} style={styles.cancel}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>

        <View>
          <Text style={styles.convertTop}>Convert {address.name} to Fiat</Text>

          <Text style={styles.convertPrice}>Amount of {address.name} in NGN you want to convert to Fiat</Text>
          <Text style={styles.minimum}>Minimum amount NGN 500</Text>
          <View style={styles.addressInput}>
            <Foundation name="dollar" size={30} color="black" />
            <TextInput
              style={styles.address}
              placeholder="200"
              onChangeText={(val) => amountHandler(val)}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <Text style={styles.processing}>Processing fee ~ 2%</Text>

          <Text style={styles.addressText}>Your fiat wallet will be credited with: </Text>
          <View style={styles.addressInput}>
            <Foundation name="dollar" size={30} color="black" />
            <Text style={styles.address}>{amount}</Text>

          </View>

        </View>
        {verifiedSell ?
          <TouchableOpacity style={styles.sendBtn} onPress={() => { sell() }}>
            <Text style={styles.sendText}> Convert To Fiat </Text>
            <Feather name="send" size={20} color="whitesmoke" />
          </TouchableOpacity>
          :
          null
        }
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1 }} refreshControl={
      <RefreshControl refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true)
          setCleanUp(cleanup + 1)

        }} />
    }>
      <View style={styles.container}>

        {/* <View style={styles.container}> */}
        <View style={styles.containerInner}>

          <View style={styles.header}>
            <Text style={styles.text_wallet}>{address.name}</Text>
            {/* <Text style={styles.text_header}>${address.name === "BNB" && bnb / 242205133645110.0000 || address.name === "ETH" && eth / 242205133645110.0000}</Text> */}
            <Avatar.Image
              source={
                images[ix]
              }
              style={{ backgroundColor: "white" }}
              size={40}
            />

            {address.name === "BTC" ? <Text style={styles.text_header}>&#x20A6; {btc}</Text> : null}

            {address.name === "BNB" ? <Text style={styles.text_header}>&#x20A6; {bnb}</Text> : null}

            {address.name === "ETH" ? <Text style={styles.text_header}>&#x20A6; {eth}</Text> : null}

            {address.name === "USDT" ? <Text style={styles.text_header}>&#x20A6; {usdt}</Text> : null}

            <View style={styles.buttons}>

              <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Buy")}>
                <View style={styles.button}>
                  <Entypo name="cycle" size={24} color="whitesmoke" />
                  {/* <Feather name="send" size={20} color="whitesmoke" /> */}
                </View>
                <Text style={styles.buttonText}>
                  Fiat to {address.name}
                </Text>

              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Send")}>
                <View style={styles.button}>

                  <Feather name="send" size={20} color="whitesmoke" />
                </View>
                <Text style={styles.buttonText}>
                  Send {address.name}
                </Text>

              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Sell")}>
                <View style={styles.button}>
                  <Entypo name="cycle" size={24} color="whitesmoke" />
                  {/* <Feather name="send" size={20} color="whitesmoke" /> */}
                </View>
                <Text style={styles.buttonText}>
                  {address.name} to Fiat
                </Text>

              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.buttonView} onPress={() => setPage("Airtime")}>
              <View style={styles.button}>

                <Feather name="send" size={20} color="whitesmoke" />
              </View>
              <Text style={styles.buttonText}>
                {address.name} to Airtime
              </Text>

            </TouchableOpacity> */}
            </View>
          </View>


        </View>

        <View style={styles.cryptos}>
          <TouchableOpacity style={styles.cryptoAddressTouch} onPress={() => {
            setPage("Receive")
          }}>

            <Text style={styles.cryptoAddress}>
              {address.address}
            </Text>
            <AntDesign name="qrcode" size={24} color="black" />
          </TouchableOpacity>

          <ScrollView horizontal={true} style={{}}>
            <View style={styles.cryptoList}>
              {
                user && user.wallets.map((item, ix) => (
                  <TouchableOpacity horizontal={true} style={styles.crypCont} key={item.address+item.name} onPress={() => { setAddress0(item); setIx(ix) }}>
                    <Avatar.Image
                      source={
                        images[ix]
                      }
                      style={{ backgroundColor: "white" }}
                      size={40}
                    />
                    <Text style={styles.crypText}>{item.name}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
          </ScrollView>

        </View>
        {/* </View>  #febf1226*/}


      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  cancel: {
    top: 0,
    marginBottom: 20
  },
  container: {
    flex: 1,
    // backgroundColor: 'white',
    alignItems: 'center',
  },

  containerSend: {
    flex: 1,
    backgroundColor: '#febf1226',
    paddingHorizontal: 10
  },
  addressText: {
    marginBottom: 5,
  },
  addressInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 30
  },
  address: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    width: "90%"
  },
  containerInner: {

    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  airContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 20,
  },
  airView: {
    marginBottom: 20,
  },
  header: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: 'space-evenly',
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: "#bebbbb",
    borderWidth: 1,

  },
  text_wallet: {
    fontWeight: '300',
    fontSize: 20
  },
  text_header: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 450
  },
  buttonView: {
    alignItems: "center"
  },
  button: {
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: "#febf12",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "whitesmoke",
    borderWidth: 2,
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

  },
  pheader: {
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
  barcodebox: {
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: "center",
    height: 300,
    width: 300,
    // overflow: "hidden",
    borderRadius: 30,
    // backgroundColor: "tomato"
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    color: "black",
  },
  cryptos: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#febf1226",
    width: "100%",
    flex: 1
  },
  cryptoAddress: {

    // width: "100%"
  },
  crypText: {
    fontWeight: "600",
    marginTop: 10,
  },
  cryptoAddressTouch: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    borderColor: "#febf12",
    borderWidth: 1,
  },
  cryptoList: {
    display: "flex",
    flexDirection: "row",
    width: 400,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 50,
    marginBottom: 30
  },
  crypCont: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  convertTop: {
    fontWeight: '900',
    alignSelf: "center",
    marginBottom: 20
  },
  convertPrice: {
    fontWeight: "500"
  },
  minimum: {
    fontWeight: "500",
    color: "red"
  },
  processing: {
    fontWeight: "500",
    color: "#febf12",
    marginBottom: 5
  },
  sendBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#febf12",
    borderRadius: 15,
    marginHorizontal: 20,
  },
  sendText: {
    fontWeight: "800",
    color: "whitesmoke"
  },
  codes: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  qrView: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  qrtext: {
    fontWeight: "500"
  },
  qrtext2: {
    fontWeight: "bold",
    marginBottom: 50
  },
});


export default Crypto

{/* <NavigationContainer independent={true}> */ }
{/* <CryptoStack.Navigator> */ }
{/* <CryptoStack.Screen name="Fiat" component={CryptoPage} options={{ headerShown: false }} /> */ }

{/* <CryptoStack.Screen name="Fund Fiat" component={FundFiat} options={{ headerShown: true }} /> */ }

{/* <CryptoStack.Screen name="sign-3" component={SignUp3} options={{ headerShown: false }} /> */ }

{/* </CryptoStack.Navigator> */ }
{/* </NavigationContainer> */ }