import React, { Component } from "react";
import { Button, Image, StyleSheet, View } from "react-native";

import { BackHandler } from 'react-native';

import database from "@react-native-firebase/database"

const ROOMS = '/rooms/'
const BONUS = '/bonus/'
const PLAYERS = '/players/'

export default class BonusScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bonus: null,
            sala: this.props.route.params.sala,
            user: this.props.route.params.user
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        if (!this.state.bonus) {
            const min = 1;
            const max = 11;
            const filho = Math.floor(min + Math.random() * (max - min))

            await database().ref(BONUS + filho)
                .once('value')
                .then(snapshot => {
                    this.setState({ bonus: snapshot.val() });
                })

            const sala = this.state.sala
            var player
            await database().ref(ROOMS + sala.name + PLAYERS + this.props.route.params.vez)
                .once('value')
                .then(snapshot => {
                    player = snapshot.val()
                })

            if (filho == 1 && player.ajudasAnalistaSenior < 1) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ ajudasAnalistaSenior: player.ajudasAnalistaSenior + 1 })
            }

            if (filho == 2 && player.ajudasAnalistaJunior < 1) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ ajudasAnalistaJunior: player.ajudasAnalistaJunior + 1 })
            }

            if (filho == 3) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ ajudasAnalistaSenior: player.ajudasAnalistaSenior + 1 })
            }

            if (filho == 4) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ ajudasAnalistaJunior: player.ajudasAnalistaJunior + 1 })
            }

            if (filho == 5 || filho == 9 || filho == 11) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ pontuacao: player.pontuacao + 1 })
            }

            if (filho == 6 || filho == 7) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ pontuacao: player.pontuacao + 2 })
            }

            if (filho == 8 || filho == 10) {
                database().ref(ROOMS + sala.name + PLAYERS + player.nickname)
                    .update({ pontuacao: player.pontuacao + 3 })
            }
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    render() {
        const { bonus } = this.state
        return (
            <View style={styles.container}>
                {
                    bonus &&
                    <View style={styles.containerImagem}>
                        <Image source={{ uri: bonus['url'] }} style={styles.imagem} />
                        <Button
                            color='#1785C1'
                            title='VOLTAR'
                            onPress={
                                () => {
                                    this.props.route.params.mudarVez(this.props.route.params.vez)
                                    this.props.navigation.goBack()
                                }
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
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },

    containerImagem: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        padding: 5
    },

    imagem: {
        width: '100%',
        height: '80%',
    },
})