import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

class Fiat extends Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Fiat Screen!</Text>
                <Button title="Fund" onPress={() => this.props.navigation.goBack()} />
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

export default Fiat