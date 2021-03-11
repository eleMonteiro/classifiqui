import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, ActivityIndicator, Alert, Button } from "react-native";
import { BackHandler } from 'react-native';

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database"

const ROOMS = '/rooms/'
const USERS = '/users/'
const PLAYERS = '/players/'

export default class Room extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nome: '',
            user: '',
            loading: false,
        }

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getUser()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    getUser = async () => {
        const userID = auth().currentUser.uid
        await database().ref(USERS + userID)
            .once('value')
            .then(snapshot => {
                const user = snapshot.val()
                console.log(user);
                this.setState({ user: user })
            });
    }

    getSala = async () => {
        const nomeSala = this.state.nome

        if (nomeSala) {
            await database().ref(ROOMS + nomeSala)
                .once('value')
                .then(snapshot => {
                    const sala = snapshot.val()

                    console.log(sala.qtd + " " + sala.max);
                    if (sala.qtd < sala.max) {
                        this.editarSala(sala)
                    } else {
                        Alert.alert('Sala cheia!')
                    }

                }).catch(() => {
                    this.criarSala(nomeSala)
                })
        } else {
            Alert.alert('Campo vazio!')
        }
    }

    criarSala = async (nome) => {
        const user = this.state.user

        const ordem = []
        ordem.push({
            nickname: user.nickname,
            vez: true
        })

        const element = {
            name: nome,
            max: 7,
            min: 3,
            qtd: 0,
            ordemDeJogada: ordem,
            vez: user.nickname
        }

        await database().ref(ROOMS + element.name).set(element)
        await database().ref(ROOMS + element.name).update({ qtd: element.qtd + 1 })
        await database().ref(ROOMS + element.name + PLAYERS + user.nickname).set({
            nickname: user.nickname,
            ajudasAnalistaSenior: 1,
            ajudasAnalistaJunior: 2,
            requisitosClassificados: 0,
            usouAjuda: false,
            jogadas: 1,
            pontuacao: 0
        })

        this.setState({ loading: false })
        this.props.navigation.navigate('Inicial', { nome: nome })
    }

    editarSala = async (sala) => {
        const user = this.state.user

        if (!sala.players.hasOwnProperty(user.nickname)) {
            const ordem = sala.ordemDeJogada

            ordem.push({
                nickname: user.nickname,
                vez: false
            })

            await database().ref(ROOMS + sala.name).update({ qtd: sala.qtd + 1, ordemDeJogada: ordem })
            await database().ref(ROOMS + sala.name + PLAYERS + user.nickname)
                .set({
                    nickname: user.nickname,
                    ajudasAnalistaSenior: 1,
                    ajudasAnalistaJunior: 2,
                    requisitosClassificados: 0,
                    usouAjuda: false,
                    jogadas: 1,
                    pontuacao: 0
                })

            this.setState({ loading: false })
        }

        this.setState({ loading: false })
        this.props.navigation.navigate('Inicial', { nome: this.state.nome })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerImagem}>
                    <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem} />
                    <Text>Vamos Começar!</Text>

                    <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(nome) => this.setState({ nome })}
                        placeholder="Nome da Sala"
                    />
                    <View style={styles.containerBTN}>
                        <Button
                            color='#FA7921'
                            title='JOGAR'
                            onPress={
                                () => {
                                    this.setState({ loading: true })
                                    this.getSala()
                                }
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

    containerImagem: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

    imagem: {
        width: '40%',
        height: '40%',
    },

    containerBTN: {
        width: "80%",
        alignItems: 'stretch',
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        color: '#111111'
    }
})