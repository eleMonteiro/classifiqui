import React, { Component } from "react";
import { Text, Button, Image, View, StyleSheet, ActivityIndicator, Alert } from "react-native";

import { BackHandler } from 'react-native';

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import storage from "@react-native-firebase/storage";


function shuffle(array) {
    var tmp, current, top = array.length;

    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
}

const ROOMS = '/rooms/'
const USERS = '/users/'
const REQS = '/reqs/'
const TIPOS = '/tipos/'

export default class Initial extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            sala: null,
            user: null,
            players: 0,
            tipos: null,
            bonus: null,
            reqs: null
        }

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        
        this.getTipos()
        this.getUser()
        this.onSala()
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
                this.setState({ user: user })
            });
    }

    onSala = () => {
        const nome = this.props.route.params.nome
        const salaRef = database().ref(ROOMS + nome)

        salaRef.on('value', snapshot => {
            const data = snapshot.val()

            this.setState({ name: data.name })
            this.setState({ sala: data })
            this.setState({ players: data.qtd })
            this.setState({ reqs: data.reqs })
        })
    }

    getTipos = async () => {
        await database().ref(TIPOS).once('value').then(snapshot => {
            this.setState({ tipos: snapshot.val() })
        })
    }

    setRequisitos = async (projeto) => {
        const nome = this.props.route.params.nome
        const proj = projeto

        await storage().ref('/' + proj + '/')
            .listAll()
            .then(function (res) {
                res.items.forEach((itemRef) => {
                    var tipo = itemRef.name.split('carta-')[1]
                    database().ref(ROOMS + nome + REQS + itemRef.name.split('.')[0]).set({
                        name: itemRef.name.split('.')[0],
                        url: itemRef.fullPath,
                        classificada: false,
                        classificou: null,
                        tipo: tipo.split(/(-\d)/)[0]
                    })
                })
            }).catch(function (error) {
                console.log(error);
            });

        this.embaralhar()
    }

    embaralhar = async () => {
        const nome = this.props.route.params.nome
        var data = null

        await database().ref(ROOMS + nome)
            .once('value')
            .then(snapshot => {
                data = snapshot.val()
            })

        if (data.reqs) {
            var requisitos = data.reqs
            var _requisitos = []

            if (requisitos) {
                for (var [key, value] of Object.entries(requisitos)) {
                    const url = await storage().ref(value.url).getDownloadURL()
                    value.url = url
                    _requisitos.push(value)
                }
            }

            const _reqs = shuffle(_requisitos)
            await database().ref(ROOMS + nome).update({ reqs: _reqs });
        }
    }

    render() {

        const { sala, user, players, tipos } = this.state

        return (
            <View style={styles.container} >
                <View style={styles.containerImagem}>
                    <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem} />

                    <ActivityIndicator animating={this.state.players < 3} size="small" color="#FA7921" />
                    {players < 3 && <Text style={styles.loading}>ESPERANDO JOGADORES</Text>}

                    <View style={styles.containerBTN}>
                        {
                            players == 1 && !sala.reqs &&
                            <>
                                <Text style={styles.projeto}>ESCOLHA O PROJETO QUE QUER QUE SUA EQUIPETRABALHE.</Text>
                                <Button
                                    color='#FA7921'
                                    title="GREATOUR"
                                    onPress={
                                        () => Alert.alert(
                                            "GREATOUR",
                                            "É um aplicativo desenvolvido no Great para apoiar os visitantes do laboratório, que funciona como um guia móvel de visita. Mostra ao usuário sua localização, as salas, informações da sala, descrição dos funcionários ou pesquisadores e o acompanha em tempo real pelo seu tour de visita no laboratório.",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                {
                                                    text: "OK", onPress: () => {
                                                        this.setRequisitos('GREATOUR')
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                />

                                <Button
                                    color='#FA7921'
                                    title="GREAT PRINT"
                                    onPress={
                                        () => Alert.alert(
                                            "GREAT PRINT",
                                            "É uma aplicação que foi desenvolvida para apoiar a impressão de documentos no Great, para os funcionários dos diversos setores, como do financeiro. Com esse aplicativo os membros do Great também podem imprimir a partir de seus smartphones e essa impressão deve ser feita na impressora mais próxima do usuário requisitante.",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    stSyle: "cancel"
                                                },
                                                {
                                                    text: "OK", onPress: () => {
                                                        this.setRequisitos('GREATPRINT')
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                />

                                <Button
                                    color='#FA7921'
                                    title="ADOTE"
                                    onPress={
                                        () => Alert.alert(
                                            "ADOTE",
                                            "É um sistema para apoiar o cuidado e adoção de animais. Centraliza as burocracias de adoção entre quem cuida dos animais resgatados e quem adota, como também quem ajuda com os custos dos cuidados.",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    stSyle: "cancel"
                                                },
                                                {
                                                    text: "OK", onPress: () => {
                                                        this.setRequisitos('ADOTE')
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        )
                                    }
                                />

                                <Button
                                    color='#FA7921'
                                    title="CAFETERIA"
                                    onPress={
                                        () => Alert.alert(
                                            "CAFETERIA",
                                            "É um sistema retirado do livro base da disciplina de Requisitos de Software. Serve para apoiar os funcionários de uma empresa gerenciando seus pedidos de comida.",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    stSyle: "cancel"
                                                },
                                                {
                                                    text: "OK", onPress: () => {
                                                        this.setRequisitos('CAFETERIA')
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        )}
                                />
                            </>
                        }
                        {
                            players >= 3 &&
                            <Button
                                color='#FA7921'
                                title='INICIAR'
                                onPress={
                                    () => {
                                        this.props.navigation.navigate('Game', {
                                            sala: sala,
                                            user: user,
                                            tipos: tipos
                                        })
                                    }
                                }
                            />
                        }
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
        width: '100%',
        height: '80%',
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },

    imagem: {
        width: 400,
        height: 400,
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        margin: 15,
        color: '#111111'
    },

    loading: {
        color: '#FA7921',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 15
    },

    projeto: {
        color: '#FA7921',
        fontSize: 15,
        marginBottom: 15,
        textAlign: "center",
    },

    button: {
        width: 'auto',
        backgroundColor: '#FA7921',
        margin: 10,
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15,
    },
})