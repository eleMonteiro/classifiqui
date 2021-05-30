import React from 'react';
import Context from './roomContext';

import database from "@react-native-firebase/database";
import storage from "@react-native-firebase/storage";
import { Alert } from 'react-native';

const ROOMS = '/rooms/'
const REQS = '/requisitos/'
const PLAYERS = '/jogadores/'
const AJUDAS = '/ajudas/'

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

export default class GlobalStateGame extends React.Component {

    state = {
        ordemJogada: null,
        jogadorDaVez: null,
        bonusDoJogador: false,
        analistaSenior: null,
        analistaJunior: null,
        requisitosClassificar: null
    }


    onSala = () => {
        database().ref(ROOMS + _sala.nome).on('value', (snapshot) => {
            const data = snapshot.val();
            this.setState({ ordemJogada: data.ordemDeJogada })
            this.setState({ jogadorDaVez: data.jogadorDaVez })
            this.setState({ requisitosClassificar: data.requisitos })
        });
    }
    getAjudasJogador = async (_sala, _usuario) => {
        await database().ref(ROOMS + _sala.nome + PLAYERS + this.state.jogadorDaVez)
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
    }

    mudarJogadorDaVez = async (_sala, _jogadorDaVez) => {
        await database().ref(ROOMS + _sala.nome + PLAYERS + vez)
            .update({ jogadas: 1, usouAjuda: false })

        for (let i = 0; i < this.state.ordemJogada.length; i++) {
            const element = this.state.ordemJogada[i];
            if (vez == element['nickname'] && i == (this.state.ordemJogada.length - 1)) {

                database().ref(ROOMS + _sala.nome + ORDEM + i).update({ vez: false })

                const j = 0
                database().ref(ROOMS + _sala.nome + ORDEM + j).update({ vez: true })
                database().ref(ROOMS + _sala.nome).update({ vez: this.state.ordemJogada[0]['nickname'] })

            } else if (vez == element['nickname']) {
                database().ref(ROOMS + _sala.nome + ORDEM + i).update({ vez: false })

                const j = i + 1

                if (j < this.state.ordemJogada.length) {
                    database().ref(ROOMS + _sala.nome + ORDEM + j).update({ vez: true })
                    database().ref(ROOMS + _sala.nome).update({ vez: this.state.ordemJogada[j]['nickname'] })
                } else {
                    database().ref(ROOMS + _sala.nome + ORDEM + j).update({ vez: true })
                    database().ref(ROOMS + _sala.nome).update({ vez: this.state.ordemJogada[0]['nickname'] })
                }
            }
        }

        this.setState({ bonusDoJogador: false })
    }

    classificarRequisito = async (_sala, _requisito, _tipo, _indice) => {
        const _tipoEsperado = _requisito['tipo']

        if (_tipoEsperado == _tipo) {
            this.editarRequisitos(_sala, _indice)
            this.pontuacao(_sala, this.state.jogadorDaVez)

            var player

            await database().ref(ROOMS + _sala.nome + PLAYERS + this.state.jogadorDaVez)
                .once('value')
                .then(snapshot => {
                    player = snapshot.val()
                })
        } else {
            Alert.alert('VOCÊ ERROU!');
            this.mudarJogadorDaVez(_sala, this.state.jogadorDaVez)
        }
    }

    editarRequisitos = (_sala, _requisito) => {
        database().ref(ROOMS + _sala.nome + REQS + _requisito)
            .update({ classificada: true })
    }

    pontuacao = async (_sala, _usuario) => {
        var player

        await database().ref(ROOMS + _sala.nome + PLAYERS + _usuario)
            .once('value')
            .then(snapshot => {
                player = snapshot.val()
            })

        await database().ref(ROOMS + _sala.nome + PLAYERS + player.nickname)
            .update({
                pontuacao: player.pontuacao + 1,
                requisitosClassificados: player.requisitosClassificados + 1,
            })

        if (player.jogadas == 1) {
            await database().ref(ROOMS + _sala.nome + PLAYERS + player.nickname)
                .update({
                    jogadas: player.jogadas + 1
                })
        }

        if (player.jogadas == 1 && player.usouAjuda) {
            this.mudarJogadorDaVez(_sala, this.state.vez)
        }

        if (player.jogadas == 2 && player.usouAjuda) {
            this.mudarJogadorDaVez(_sala, this.state.vez)
        }

        if (player.jogadas == 2 && !player.usouAjuda) {
            this.setState({ bonusDoJogador: true })
        }
    }

    usarAnalistaSenior = async (_sala, _usuario, _requisito) => {
        var player
        await database().ref(ROOMS + _sala.nome + PLAYERS + this.state.jogadorDaVez)
            .once('value')
            .then(snapshot => {
                player = snapshot.val()
            })

        database().ref(ROOMS + _sala.nome + PLAYERS + player.nickname).update({ ajudasAnalistaSenior: player.ajudasAnalistaSenior - 1, usouAjuda: true })

        const req = _requisito['tipo']
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

    usarAnalistaJunior = async (_sala, _usuario, _requisito) => {

        var player
        await database().ref(ROOMS + _sala.nome + PLAYERS + this.state.jogadorDaVez)
            .once('value')
            .then(snapshot => {
                player = snapshot.val()
            })


        database().ref(ROOMS + _sala.nome + PLAYERS + player.nickname).update({ ajudasAnalistaJunior: player.ajudasAnalistaJunior - 1, usouAjuda: true })


        const req = _requisito['tipo']

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
        return (
            <Context.Provider
                value={{
                    ordemJogada: this.state.ordemJogada,
                    jogadorDaVez: this.state.jogadorDaVez,
                    bonusDoJogador: this.state.bonusDoJogador,
                    analistaSenior: this.state.analistaJunior,
                    analistaJunior: this.state.analistaSenior,
                    requisitosClassificar: this.state.requisitosClassificar,
                    onSala: this.onSala,
                    mudarJogadorDaVez: this.mudarJogadorDaVez,
                    classificarRequisito: this.classificarRequisito,
                    editarRequisito: this.editarRequisitos,
                    pontuacao: this.pontuacao,
                    usarAnalistaSenior: this.usarAnalistaSenior,
                    usarAnalistaJunior: this.usarAnalistaJunior,
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}