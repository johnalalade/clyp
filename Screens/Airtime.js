import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

class Airtime extends Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Airtime Screen!</Text>
                <Button title="Sign In" onPress={() => this.props.navigation.goBack()} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Airtime