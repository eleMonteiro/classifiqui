import React from 'react';

export default React.createContext({
    nome: null,
    sala: {},
    jogadores: 0,
    tiposDeRequisitos: null,
    bonus: null,
    requisitos: null,
    getTipos: () => { },
    setRequisitos: (projeto) => { },
    getSala: (_nome) => { },
    criarSala: (_nome) => { },
    editarSala: (_nome) => { },
});