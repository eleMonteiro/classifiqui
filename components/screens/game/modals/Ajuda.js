import React, { Component } from "react";
import { Text, View, StyleSheet, Button, Alert, Image, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { BackHandler } from 'react-native';

import CardFlip from 'react-native-card-flip';

import database from "@react-native-firebase/database"

const tipos = [
    {
        text: "Requisito de Negócio",
        tipo: "requisito-negocio",
    },
    {
        text: "Regra de Negócio",
        tipo: "regras-de-negocio",
    },
    {
        text: "Restrição",
        tipo: "restricao",
    }, {
        text: "Requisitos de Interface Externa",
        tipo: "requisitos-de-interface-externa",
    },
    {
        text: "Feature",
        tipo: "feature",
    },
    {
        text: "Requisito Funcional",
        tipo: "requisito-funcional",
    },
    {
        text: "Requisito Não-Funcional",
        tipo: "requisito-nao-funcional",
    }, {
        text: "Atributo de Qualidade",
        tipo: "atributo-de-qualidade",
    },
    {
        text: "Requisito de Sistema",
        tipo: "requisito-de-sistema",
    },
    {
        text: "Requisito de Usuário",
        tipo: "requisito-de-usuario",
    }
]

const ROOMS = '/rooms/'
const PLAYERS = '/players/'
const AJUDAS = '/ajudas/'

export default class AjudaScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            analistaSenior: null,
            analistaJunior: null,
            user: this.props.route.params.user,
            sala: this.props.route.params.sala,
            req: this.props.route.params.req,
            tipos: this.props.route.params.tipos,
            ajudas: []
        }

        this.usarAnalistaSenior = this.usarAnalistaSenior.bind(this)
        this.usarAnalistaJunior = this.usarAnalistaJunior.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        const sala = this.state.sala

        await database().ref(ROOMS + sala.name + PLAYERS + this.props.route.params.vez)
            .once('value')
            .then(snapshot => {
                this.setState({ player: snapshot.val() })
            })

        if (!this.state.analistaSenior) {
            const analistaSeniorRef = database().ref(AJUDAS).child('0');
            analistaSeniorRef.on('value', (snapshot) => {
                this.setState({ analistaSenior: snapshot.val() })
            })
        }

        if (!this.state.analistaJunior) {
            const analistaJuniorRef = database().ref(AJUDAS).child('1');
            analistaJuniorRef.on('value', (snapshot) => {
                this.setState({ analistaJunior: snapshot.val() })
            })
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        ToastAndroid.show('CLIQUE NA CARTA PARA MUDAR O TIPO DA AJUDA', ToastAndroid.SHORT)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    usarAnalistaSenior = async () => {
        const sala = this.state.sala

        var player
        await database().ref(ROOMS + sala.name + PLAYERS + this.props.route.params.vez)
            .once('value')
            .then(snapshot => {
                player = snapshot.val()
            })

        database().ref(ROOMS + sala.name + PLAYERS + player.nickname).update({ ajudasAnalistaSenior: player.ajudasAnalistaSenior - 1, usouAjuda: true })

        const req = this.state.req['tipo']
        var resposta = null

        for (let i = 0; i < tipos.length; i++) {
            if (tipos[i].tipo == req) {
                resposta = tipos[i].text
            }
        }

        var msg = "" + resposta

        Alert.alert(
            "Tipo do Requisito",
            msg,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => this.props.navigation.goBack()
                }
            ],
            { cancelable: false }
        )

    }


    usarAnalistaJunior = async () => {
        const sala = this.state.sala

        var player
        await database().ref(ROOMS + sala.name + PLAYERS + this.props.route.params.vez)
            .once('value')
            .then(snapshot => {
                player = snapshot.val()
            })


        database().ref(ROOMS + sala.name + PLAYERS + player.nickname).update({ ajudasAnalistaJunior: player.ajudasAnalistaJunior - 1, usouAjuda: true })


        const req = this.state.req['tipo']

        const filho = []
        while (filho.length < 3) {
            var aleatorio = Math.floor(Math.random() * 10)
            if (filho.indexOf(aleatorio) == -1 && req != tipos[aleatorio].tipo)
                filho.push(aleatorio);
        }

        const respostas = []
        respostas.push(tipos[filho[0]].text)
        respostas.push(tipos[filho[1]].text)

        for (let i = 0; i < tipos.length; i++) {
            if (tipos[i].tipo == req) {
                respostas.push(tipos[i].text)
            }
        }

        var m = respostas.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = respostas[m];
            respostas[m] = respostas[i];
            respostas[i] = t;
        }

        var msg = "1. " + respostas[0] + "; 2. " + respostas[1] + "; 3. " + respostas[2]

        Alert.alert(
            "Tipos possíveis",
            msg,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.props.navigation.goBack() }
            ],
            { cancelable: false }
        )
    }

    render() {
        const { analistaSenior, analistaJunior, player } = this.state

        return (
            <CardFlip style={styles.container} ref={card => (this.card = card)}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.containerImagem}
                    onPress={() => this.card.flip()}>
                    {
                        analistaSenior &&
                        <>
                            <Image source={{ uri: analistaSenior['url'] }} style={styles.imagem} />
                            <Text style={styles.text}>Ajudas Restantes: {player.ajudasAnalistaSenior}</Text>
                        </>
                    }
                    {
                        analistaSenior && player.ajudasAnalistaSenior >= 1 &&
                        <Button
                            color='#0D7A18'
                            title='USAR AJUDA'
                            onPress={() => this.usarAnalistaSenior()}
                        />
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.containerImagem}
                    onPress={() => this.card.flip()}>
                    {
                        analistaJunior &&
                        <>
                            <Image source={{ uri: analistaJunior['url'] }} style={styles.imagem} />
                            <Text style={styles.text}>Ajudas Restantes: {player.ajudasAnalistaJunior}</Text>
                        </>
                    }
                    {
                        analistaJunior && player.ajudasAnalistaJunior >= 1 &&
                        <Button
                            color='#0D7A18'
                            title='USAR AJUDA'
                            onPress={() => this.usarAnalistaJunior()}
                        />
                    }
                </TouchableOpacity>
            </CardFlip>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
    },

    containerImagem: {
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 5,
        shadowColor: 'rgba(0,0,0,0.5)',

        shadowOffset: {
            width: 0,
            height: 1,
        },

        shadowOpacity: 0.5,
    },

    imagem: {
        width: '100%',
        height: '80%',
    },

    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        padding: 2,
        borderRadius: 5,
        marginTop: 5,
        textAlign: 'center'
    },
})
