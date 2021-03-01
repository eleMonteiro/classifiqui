import React, { Component } from 'react'
import { Alert, Button, StyleSheet } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from '../screens/home/Home'
import Login from '../screens/home/Login'
import CriarConta from '../screens/home/CriarConta'

import Initial from '../screens/room/Initial'
import Room from '../screens/room/Room'

import Game from '../screens/game/Game'
import Classificar from '../screens/game/modals/Classificar'
import Ajuda from '../screens/game/modals/Ajuda'
import Bonus from '../screens/game/modals/Bonus'

import Ranking from '../screens/ranking/Ranking'

const Stack = createStackNavigator();

export default class Router extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const estiloCabecalho = {
            headerTitle: 'Classifiqui',
            headerStyle: {
                backgroundColor: '#fa7921',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerLeft: null,
        }

        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home} options={estiloCabecalho} />
                    <Stack.Screen name="Login" component={Login} options={estiloCabecalho} />
                    <Stack.Screen name="CriarConta" component={CriarConta} options={estiloCabecalho} />


                    <Stack.Screen
                        name="Inicial"
                        component={Initial}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                                headerLeft: null,
                            }
                        }
                    />

                    <Stack.Screen
                        name="Game"
                        component={Game}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                                headerLeft: null,
                            }
                        }

                    />

                    <Stack.Screen
                        name="Room"
                        component={Room}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                                headerLeft: null,
                            }
                        }
                    />

                    <Stack.Screen
                        name="Classificar"
                        component={Classificar}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    />

                    <Stack.Screen
                        name="Ajuda"
                        component={Ajuda}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    />

                    <Stack.Screen
                        name="Bonus"
                        component={Bonus}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    />

                    <Stack.Screen name="Ranking" component={Ranking} options={estiloCabecalho} />

                </Stack.Navigator>
            </NavigationContainer>
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

    header: {
        backgroundColor: '#fa7921'
    }
});
