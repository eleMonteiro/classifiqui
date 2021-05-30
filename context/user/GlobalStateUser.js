import React from 'react';
import Context from './userContext';

import database from "@react-native-firebase/database"
import auth from "@react-native-firebase/auth";

const USERS = '/users/'

export default class GlobalStateUser extends React.Component {

    state = {
        usuario: {}
    }

    criarConta = async (_usuario) => {
        await auth()
            .createUserWithEmailAndPassword(_usuario.email, _usuario.password)
            .then(({ response }) => {

                database().ref(USERS + response.uid).set({
                    nickname: _usuario.nome
                })

                return true
            })

            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    return error.code
                }

                if (error.code === 'auth/invalid-email') {
                    return error.code
                }

                return false
            });
    }

    login = async (_usuario) => {
        await auth().signInWithEmailAndPassword(_usuario.email, _usuario.password)
            .then(() => {
                getUsuario()
                return true
            })
            .catch(() => { return false });
    }

    logout = async (_usuario) => {
        await auth()
            .signOut()
            .then(() => {
                this.setState({ usuario: {} })
                return true
            })
            .catch(() => { return false });
    }

    getUsuario = async () => {
        const usuarioID = auth().currentUser.uid
        await database().ref(USERS + usuarioID)
            .once('value')
            .then(snapshot => {
                const usuario = snapshot.val()
                this.setState({ usuario: usuario })
            });
    }

    render() {
        return (
            <Context.Provider
                value={{
                    usuario: this.state.usuario,
                    criarConta: this.criarConta,
                    login: this.login,
                    logout: this.logout,
                    getUsuario: this.getUsuario
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}