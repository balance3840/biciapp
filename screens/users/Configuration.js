import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard, AsyncStorage, Alert } from 'react-native';

class ConfigurationScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
    }

    componentDidMount() {
        this.getUser();
    }


    getUser = async () => {
        const username = await AsyncStorage.getItem("username");
        if(username) {
            this.setState({ username });
        }
    }

    onSave = async() => {
        await AsyncStorage.setItem("username", this.state.username);
        Alert.alert("Guardado", "Los cambios fueron guardadados exitosamente.");
    }


    render() {
        const { username } = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.Os == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>Nombre de usuario</Text>
                        <TextInput placeholder="Username" value={username} onChangeText={(username) => this.setState({ username }) } style={styles.textInput} />
                        <View style={styles.btnContainer}>
                            <Button title="Guardar cambios" onPress={() => this.onSave()} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1
    },
    header: {
        fontSize: 16,
        marginBottom: 10
    },
    textInput: {
        height: 40,
        backgroundColor: "#ffffff",
        padding: 10,
        marginBottom: 36
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12
    }
});


export default ConfigurationScreen;