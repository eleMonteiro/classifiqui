import React, { Component } from "react";
import { TextInput, Image, View, StyleSheet, ActivityIndicator, Button, ToastAndroid } from "react-native";

import database from "@react-native-firebase/database"
import auth from "@react-native-firebase/auth";

const USERS = '/users/'

export default class CriarConta extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nome: '',
            email: '',
            password: '',
            loading: false
        }

    }

    criarConta = async () => {

        if (this.state.nome != null && this.state.email != null && this.state.password != null) {
            await auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(({user}) => {

                    database().ref(USERS + user.uid).set({
                        nickname: this.state.nome
                    })

                    this.setState({ loading: false })
                    this.props.navigation.navigate('Login')

                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        this.setState({ loading: false })
                        ToastAndroid.show('Esse endereço de email já esta em uso!', ToastAndroid.LONG)
                    }

                    if (error.code === 'auth/invalid-email') {
                        this.setState({ loading: false })
                        ToastAndroid.show('Esse endereço de e-mail é inválido!', ToastAndroid.LONG)
                    }

                    ToastAndroid.show('Erro ao criar conta!', ToastAndroid.LONG)
                    console.log(error);
                });

        } else {
            this.setState({ loading: false })
            ToastAndroid.show('Campos vazios!', ToastAndroid.LONG)
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerImagem}>
                    <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem} />

                    <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(nome) => this.setState({ nome })}
                        placeholder="Nickname"
                        textContentType="nickname"
                    />

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
                        secureTextEntry={true}
                    />

                    <View style={styles.containerBTN}>
                        <Button
                            color='#FA7921'
                            title='CRIAR'
                            onPress={
                                () => {
                                    this.setState({ loading: true })
                                    this.criarConta()
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
            </View >
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