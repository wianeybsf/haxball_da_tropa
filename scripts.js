import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLwnKqM9Ijry_zUzUtTjghIJfVp4eWPFE",
  authDomain: "haxball-ef25c.firebaseapp.com",
  projectId: "haxball-ef25c",
  storageBucket: "haxball-ef25c.firebasestorage.app",
  messagingSenderId: "453472163512",
  appId: "1:453472163512:web:b84497078cc7531bdbc64d",
  measurementId: "G-H8Z6GZ9G5T"
};

const SENHA = 'wianeyfilh0';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let jogadores = [];

document.getElementById('addList').onclick = async function() {
    const senha = prompt('Digite a senha para editar:');
    if (senha !== SENHA) {
        alert('Senha incorreta!');
        return;
    }

    const guild   = document.getElementById('insertGuild').value;
    const name    = document.getElementById('insertName').value;
    const matches = Number(document.getElementById('insertMatches').value);
    const goals   = Number(document.getElementById('insertGoal').value);
    const assists = Number(document.getElementById('insertAssist').value);

    const id = guild + '_' + name;
    const ref = doc(db, 'jogadores', id);
    const existente = await getDoc(ref);

    if (existente.exists()) {
        const atual = existente.data();
        await setDoc(ref, {
            guild,
            name,
            matches: atual.matches + matches,
            goals:   atual.goals   + goals,
            assists: atual.assists + assists
        });
    } else {
        await setDoc(ref, { guild, name, matches, goals, assists });
    }

    carregar();
};

async function carregar() {
    const snapshot = await getDocs(collection(db, 'jogadores'));
    jogadores = snapshot.docs.map(d => d.data());

    jogadores.sort((a, b) => b.goals - a.goals);

    renderizar();
}

function renderizar() {
    const tbody = document.getElementById('playerList');

    tbody.innerHTML = jogadores.map((p, index) => {
        const ppg   = p.goals + p.assists;
        const gJogo = p.matches > 0 ? (p.goals / p.matches).toFixed(2) : '—';
        const aJogo = p.matches > 0 ? (p.assists / p.matches).toFixed(2) : '—';

        let pos;
        if (index === 0) pos = '<span style="color:#f5c842">🥇</span>';
        else if (index === 1) pos = '<span style="color:#b0b8c1">🥈</span>';
        else if (index === 2) pos = '<span style="color:#cd7f32">🥉</span>';
        else pos = `<span style="color:#3d6080">${index + 1}</span>`;
        
        const guildColor = p.guild.toUpperCase() === 'HDT' ? '#f5c842' :
                   p.guild.toUpperCase() === 'CDR' ? '#ff4444' :
                   'var(--text)';

        return `<tr>
            <td>${pos}</td>
            <td style="color:${guildColor}; text-shadow: 0 0 12px ${guildColor}66">${p.guild}</td>
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
