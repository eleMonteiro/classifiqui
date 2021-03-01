import React, { Component } from "react";
import { Image, View, StyleSheet, Button } from "react-native";

import { BackHandler } from 'react-native';

export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerImagem}>

                    <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem} />
                   
                    <Button
                        color='#FA7921'
                        title='ENTRAR'
                        onPress={() => this.props.navigation.navigate('Login')} />


                    <Button
                        color='#FA7921'
                        title='CRIAR CONTA'
                        onPress={() => this.props.navigation.navigate('CriarConta')} />

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
        alignItems: 'stretch',
        justifyContent: 'space-around',
        padding: 5
    },

    imagem: {
        width: '100%',
        height: '80%',
    },
})