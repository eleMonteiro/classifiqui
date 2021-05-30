import React from 'react';
import Context from './roomContext';

import database from "@react-native-firebase/database";
import storage from "@react-native-firebase/storage";

const ROOMS = '/rooms/'
const REQS = '/reqs/'
const TIPOS = '/tipos/'

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

export default class GlobalStateRoom extends React.Component {

    state = {
        nome: null,
        sala: {},
        jogadores: 0,
        tiposDeRequisitos: null,
        bonus: null,
        requisitos: null,
    }

    getTipos = async () => {
        await database().ref(TIPOS).once('value').then(snapshot => {
            this.setState({ tiposDeRequisitos: snapshot.val() })
        })
    }

    setRequisitos = async (projeto) => {
        const nome = this.state.nome
        const proj = projeto

        await storage().ref('/' + proj + '/')
            .listAll()
            .then(function (res) {
                res.items.forEach((itemRef) => {
                    var tipo = itemRef.name.split('carta-')[1]
                    database().ref(ROOMS + nome + REQS + itemRef.name.split('.')[0]).set({
                        nome: itemRef.name.split('.')[0],
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
        const nome = this.state.nome
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

    getSala = async () => {
        const nomeSala = this.state.nome

        if (nomeSala) {
            await database().ref(ROOMS + nomeSala)
                .once('value')
                .then(snapshot => {
                    const sala = snapshot.val()

                    if (sala.quantidade < sala.quantidadeMax) {
                        this.editarSala(sala)
                    } else {
                        return false
                    }

                }).catch(() => {
                    this.criarSala(nomeSala)
                })
        } else {
            return false
        }
    }

    criarSala = async (nome, user) => {

        const ordem = []
        ordem.push({
            nickname: user.nickname,
            vezDeJogar: true
        })

        var quantidadeMax = parseInt(this.state.requisitos.length / 2)
        var quantidadeMin = parseInt(Math.sqrt(quantidadeMax))

        const element = {
            nome: nome,
            quantidadeMax: quantidadeMax,
            quantidadeMin: quantidadeMin,
            quantidade: 0,
            ordemDeJogada: ordem,
            jogadorDaVez: user.nickname
        }

        await database().ref(ROOMS + element.nome).set(element)
        await database().ref(ROOMS + element.nome).update({ quantidade: element.quantidade + 1 })
        await database().ref(ROOMS + element.nome + PLAYERS + user.nickname).set({
            nickname: user.nickname,
            ajudasAnalistaJunior: 2,
            ajudasAnalistaSenior: 1,
            jogadasDaVez: 1,
            pontuacao: 0,
            requisitosClassificados: 0,
            usouAjuda: false
        })

        return true
    }

    editarSala = async (user) => {

        const user = this.state.user

        if (!sala.players.hasOwnProperty(user.nickname)) {
            const ordem = this.state.sala.ordemDeJogada

            ordem.push({
                nickname: user.nickname,
                vez: false
            })

            await database().ref(ROOMS + this.state.sala.nome).update({ quantidade: this.state.sala.quantidade + 1, ordemDeJogada: ordem })
            await database().ref(ROOMS + this.state.sala.nome + PLAYERS + user.nickname)
                .set({
                    nickname: user.nickname,
                    ajudasAnalistaJunior: 2,
                    ajudasAnalistaSenior: 1,
                    jogadasDaVez: 1,
                    pontuacao: 0,
                    requisitosClassificados: 0,
                    usouAjuda: false
                })
        }

        return true
    }

    render() {
        return (
            <Context.Provider
                value={{
                    nome: this.state.nome,
                    sala: this.state.sala,
                    jogadores: this.state.jogadores,
                    tiposDeRequisitos: this.state.tiposDeRequisitos,
                    bonus: this.state.bonus,
                    requisitos: this.state.requisitos,
                    getTipos: this.getTipos,
                    setRequisitos: this.setRequisitos,
                    getSala: this.getSala,
                    criarSala: this.criarSala,
                    editarSala: this.editarSala
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}