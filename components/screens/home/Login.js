import React, { Component } from "react";
import { TextInput, Image, View, StyleSheet, ActivityIndicator, Button, ToastAndroid } from "react-native";

import auth from "@react-native-firebase/auth";

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loading: false
        }

    }

    login = async () => {
        await auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ loading: false })
                this.props.navigation.navigate('Room')
            })
            .catch(() => {
                this.setState({ loading: false })
                ToastAndroid.show('Não foi possivel realizar login!', ToastAndroid.LONG)
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerImagem}>

                    <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem} />

                    <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(email) => this.setState({ email })}
                        placeholder="Email"
                        textContentType="emailAddress"
                    />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(password) => this.setState({ password })}
                        placeholder="Senha"
                        textContentType="password"
                        type="password"
                        secureTextEntry={true}
                    />

                    <View style={styles.containerBTN}>
                        <Button
                            color='#FA7921'
                            title='ENTRAR'
                            onPress={
                                () => {
                                    this.setState({ loading: true })
                                    this.login()
                                }
                            }
                        />

                        <View style={{ margin: 10 }}></View>

                        <Button
                            color='#FA7921'
                            title='CANCELAR'
                            onPress={
                                () => this.props.navigation.navigate('Home')
                            }
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
    },

    containerBTN: {
        width: "80%",
        alignItems: 'stretch',
    },

    containerImagem: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 5
    },

    imagem: {
        width: '40%',
        height: '40%',
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        color: '#111111'
    },
})