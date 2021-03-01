import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Button } from "react-native";

import { BackHandler } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Divider from "react-native-divider";

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database"

const ROOMS = '/rooms/'
const PLAYERS = '/players/'
const USERS = '/users/'

export default class Ranking extends Component {

    constructor(props) {
        super(props);

        this.state = {
            elementos: [],
            user: null
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        this.getRanking()
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

    getRanking = async () => {
        const sala = this.props.route.params.sala
        var obj

        await database().ref(ROOMS + sala + PLAYERS)
            .once('value')
            .then(snapshot => {
                obj = snapshot.val()
            })

        console.log(obj);
        var elementos = []

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                elementos.push(obj[i])
            }
        }

        elementos.sort(function (a, b) { return b['pontuacao'] - a['pontuacao'] })

        this.setState({ elementos: elementos })

        this.getUser()
    }

    render() {
        const { elementos } = this.state

        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                <View style={styles.containerIMG}>
                    <Image source={require('./ranking.png')} style={styles.imagem} />
                    <Text style={styles.textRanking}>Ranking</Text>
                </View>

                <View style={styles.containerRanking}>
                    {
                        elementos.map((item, index) => {
                            return (
                                <View style={styles.container}>
                                    { index == 0 &&
                                        <>
                                            <Divider borderColor='#fa7921' color='black' orientation='center'><Text style={styles.elementos}>CAMPEÃO</Text></Divider>
                                            <Text style={styles.elementos}>{item['nickname']} </Text>

                                            <Text>Pontuação: {item['pontuacao']} ponto(s)</Text>
                                            <Text>Requisitos Classificados: {item['requisitosClassificados']}</Text>
                                        </>
                                    }
                                    { index > 0 &&
                                        <>
                                            <Divider borderColor='#fa7921' color='black' orientation='center'><Text style={styles.elementos}>{index + 1}</Text></Divider>
                                            <Text style={styles.elementos}>{item['nickname']} </Text>

                                            <Text>Pontuação: {item['pontuacao']} ponto(s)</Text>
                                            <Text>Requisitos Classificados: {item['requisitosClassificados']}</Text>
                                        </>
                                    }
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.containerBTN}>
                    <View style={{ marginRight: 10 }}>
                        <Button
                            color='#1785C1'
                            title='NOVA PARTIDA'
                            onPress={
                                () => {
                                    this.props.navigation.navigate('Room')
                                }

                            }
                        />
                    </View>

                    <Button
                        color='#1785C1'
                        title='SAIR'
                        onPress={
                            () => {
                                auth().signOut()
                                this.props.navigation.navigate('Home')
                            }

                        }
                    />
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,
        width: '100%'
    },

    containerIMG: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagem: {
        width: '50%',
        height: 100
    },

    textRanking: {
        color: '#fa7921',
        fontSize: 25,
        marginBottom: 5,
        padding: 2,
        borderRadius: 5,
        marginTop: 5
    },

    containerRanking: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'auto',
        padding: 15
    },

    elementos: {
        color: '#fa7921',
        fontSize: 20,
        padding: 2,
        borderRadius: 5,
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
})