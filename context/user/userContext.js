import React from 'react';

export default React.createContext({
    usuario: {},
    criarConta: (_usuario) => { },
    login: (_usuario) => { },
    logout: (_usuario) => { },
    getUsuario: () => { }
});