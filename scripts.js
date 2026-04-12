let jogadores = [];

document.getElementById('addList').onclick = function() {
    const guild   = document.getElementById('insertGuild').value;
    const name    = document.getElementById('insertName').value;
    const matches = Number(document.getElementById('insertMatches').value);
    const goals   = Number(document.getElementById('insertGoal').value);
    const assists = Number(document.getElementById('insertAssist').value);

    const existente = jogadores.find(p => p.name === name && p.guild === guild);

    if (existente) {
        existente.matches = matches;
        existente.goals   = goals;
        existente.assists = assists;
    } else {
        jogadores.push({ guild, name, matches, goals, assists });
    }

    salvar();
    renderizar();
};

function salvar() {
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
}

function carregar() {
    const dados = localStorage.getItem('jogadores');
    if (dados) {
        jogadores = JSON.parse(dados);
        renderizar();
    }
}

function renderizar() {
    const tbody = document.getElementById('playerList');

    tbody.innerHTML = jogadores.map(p => {
        const ppg   = p.goals + p.assists;
        const gJogo = p.matches > 0 ? (p.goals / p.matches).toFixed(2) : '—';
        const aJogo = p.matches > 0 ? (p.assists / p.matches).toFixed(2) : '—';

        return `<tr>
            <td>${p.guild}</td>
            <td>${p.name}</td>
            <td>${p.matches}</td>
            <td>${p.goals}</td>
            <td>${p.assists}</td>
            <td>${ppg}</td>
            <td>${gJogo}</td>
            <td>${aJogo}</td>
        </tr>`;
    }).join('');
}

carregar();