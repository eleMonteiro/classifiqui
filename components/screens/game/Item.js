import React, { Component } from "react";
import { Image, View, StyleSheet, Button } from "react-native";

import storage from "@react-native-firebase/storage";

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.getElement = this.getElement.bind(this)
    }

    componentDidMount() {
        this.getElement()
    }

    getElement = async () => {
        const requisitos = this.props.reqs

        for (let i = 0; i < requisitos.length; i++) {
            const element = requisitos[i];

            if (element.classificada === false) {

                const url = await storage()
                    .ref(element.url)
                    .getDownloadURL();

                console.log(url);
                                
                return (
                    <View style={styles.containerImagem}>
                        <Image
                            source={{ uri: url }}
                            style={styles.imagem}
                        ></Image>

                        {this.props.vez == this.props.user.nickname &&
                            <>
                                <Button
                                    color='#0D7A18'
                                    title='CLASSIFICAR'
                                    onPress={
                                        () =>
                                            this.props.navigation.navigate('Classificar',
                                                {
                                                    tipos: this.props.tipos,
                                                    req: element,
                                                    vez: this.props.vez,
                                                    mudarVez: this.props.mudarVez,
                                                    classificarRequisito: this.props.classificarRequisito,
                                                    indice: i
                                                })
                                    }
                                />

                                <Button
                                    color='#1785C1'
                                    title='AJUDA'
                                    onPress={
                                        () =>
                                            this.props.navigation.navigate('Ajuda',
                                                {
                                                    req: element,
                                                    sala: this.props.sala,
                                                    user: this.props.user,
                                                    tipos: this.props.tipos,
                                                    vez: this.props.vez,
                                                    mudarVez: this.props.mudarVez,
                                                    classificarRequisito: this.props.classificarRequisito,
                                                })
                                    }
                                />
                            </>
                        }
                    </View>
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.containerImagemColor}>
                <Image source={require('../LOGO-3.1-LARANJA.png')} style={styles.imagem}></Image>
                <Button
                    color='#1785C1'
                    title='RANKING'
                    onPress={
                        () =>
                            this.props.navigation.navigate('Ranking', { sala: this.props.sala.name })
                    }
                />
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