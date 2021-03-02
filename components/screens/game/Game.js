import React, { Component } from "react";
import { Image, View, StyleSheet, Button, Alert, FlatList } from "react-native";

import { BackHandler } from 'react-native';
import database from "@react-native-firebase/database"

import Item from "./Item"

const ROOMS = '/rooms/'
const ORDEM = '/ordemDeJogada/'
const REQS = '/reqs/'
const PLAYERS = '/players/'

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sala: this.props.route.params.sala,
            user: this.props.route.params.user,
            tipos: this.props.route.params.tipos,
            requisitosClassificar: this.props.route.params.sala.reqs,
            ordemJogada: null,
            vez: null,
            bonus: false
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    }


    componentDidMount() {
        this.onSala()

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    onSala = () => {
        database().ref(ROOMS + this.state.sala.name).on('value', (snapshot) => {
            const data = snapshot.val();
            this.setState({ ordemJogada: data.ordemDeJogada })
            this.setState({ vez: data.vez })
            this.setState({ requisitosClassificar: data.reqs })
        });
    }

    mudarVez = (vez) => {
        for (let i = 0; i < this.state.ordemJogada.length; i++) {
            const element = this.state.ordemJogada[i];
            if (vez == element['nickname'] && i == (this.state.ordemJogada.length - 1)) {

                database().ref(ROOMS + this.state.sala.name + ORDEM + i).update({ vez: false })

                const j = 0
                database().ref(ROOMS + this.state.sala.name + ORDEM + j).update({ vez: true })
                database().ref(ROOMS + this.state.sala.name).update({ vez: this.state.ordemJogada[0]['nickname'] })

            } else if (vez == element['nickname']) {
                database().ref(ROOMS + this.state.sala.name + ORDEM + i).update({ vez: false })

                const j = i + 1

                if (j < this.state.ordemJogada.length) {
                    database().ref(ROOMS + this.state.sala.name + ORDEM + j).update({ vez: true })
                    database().ref(ROOMS + this.state.sala.name).update({ vez: this.state.ordemJogada[j]['nickname'] })
                } else {
                    database().ref(ROOMS + this.state.sala.name + ORDEM + j).update({ vez: true })
                    database().ref(ROOMS + this.state.sala.name).update({ vez: this.state.ordemJogada[0]['nickname'] })
                }
            }
        }

        this.setState({ bonus: false })
    }

    classificarRequisito = (requisito, tipo, indice) => {
        const _requisito = requisito
        const _tipo = _requisito['tipo']

        if (_tipo == tipo) {
            this.editarRequisitos(indice)
            this.pontuacao(this.state.vez)
            this.setState({ bonus: true })
        } else {
            Alert.alert('VOCÊ ERROU!');
            this.mudarVez(this.state.vez)
        }
    }

    editarRequisitos = (requisito) => {
        database().ref(ROOMS + this.state.sala.name + REQS + requisito)
            .update({ classificada: true })
    }

    pontuacao = async (user) => {
        const sala = this.state.sala
        var player

        await database().ref(ROOMS + sala.name + PLAYERS + user)
        .once('value')
        .then(snapshot => {
            player = snapshot.val()
        })

       await database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
            .update({ pontuacao: player.pontuacao + 1, requisitosClassificados: player.requisitosClassificados + 1 })

    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.bonus && <Item
                    requisitos={this.state.requisitosClassificar}
                    user={this.state.user}
                    vez={this.state.vez}
                    tipos={this.state.tipos}
                    user={this.state.user}
                    sala={this.state.sala}
                    mudarVez={this.mudarVez.bind(this)}
                    classificarRequisito={this.classificarRequisito.bind(this)}
                    {...this.props}>
                </Item>}

                {this.state.bonus &&
                    <View style={styles.containerImagemColor}>
                        <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem}></Image>
                        <Button
                            color='#1785C1'
                            title='BONUS'
                            onPress={
                                () =>
                                    this.props.navigation.navigate('Bonus', {
                                        vez: this.state.vez,
                                        mudarVez: this.mudarVez.bind(this),
                                        sala: this.state.sala,
                                        user: this.state.user
                                    })
                            }
                        />
                    </View>
                }
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

    imagem: {
        width: '100%',
        height: '80%',
    },

    containerImagem: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
    },

    containerImagemColor: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff'
    },

    textRanking: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },

    containerRanking: {
        alignItems: 'center',
    },
})