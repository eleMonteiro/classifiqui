import React from 'react';

export default React.createContext({
    ordemJogada: null,
    jogadorDaVez: null,
    bonusDoJogador: false,
    analistaSenior: null,
    analistaJunior: null,
    requisitosClassificar: null,
    getAjudasJogador: (_sala, _usuario) => { },
    onSala: () => { },
    mudarJogadorDaVez: (_sala, _jogadorDaVez) => { },
    classificarRequisito: (_sala, _requisito, _tipo, _indice) => { },
    editarRequisito: (_sala, _requisito) => { },
    pontuacao: (_sala, _usuario) => { },
    usarAnalistaSenior: (_sala, _usuario, _requisito) => { },
    usarAnalistaJunior: (_sala, _usuario, _requisito) => { },
});