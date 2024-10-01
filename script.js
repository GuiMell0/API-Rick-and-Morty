const url = `https://rickandmortyapi.com/api/character`;
const listaPersonagensDiv = document.getElementById("lista-personagens");
const listaFavoritosDiv = document.getElementById("lista-favoritos");
const btnInicio = document.getElementById("btn-inicio");
const btnFavoritos = document.getElementById("btn-favoritos");
const btnPesquisar = document.getElementById("btn-pesquisar");
const inputPesquisa = document.getElementById("input-pesquisa");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

async function fetchAllPersonagens(paginaAtual = 1, allPersonagens = []) {
    try {
        const response = await fetch(`${url}?page=${paginaAtual}`);
        const data = await response.json();
        allPersonagens = allPersonagens.concat(data.results);

        if (paginaAtual < data.info.pages && allPersonagens.length < 100) {
            return fetchAllPersonagens(paginaAtual + 1, allPersonagens);
        }
        exibirPersonagens(allPersonagens.slice(0, 100));
    } 
    catch (error) {
        console.error("Erro ao buscar os personagens:", error);
    }
}

function exibirPersonagens(personagens) {
    listaPersonagensDiv.innerHTML = "";

    personagens.forEach(personagem => {
        const div = document.createElement("div");
        div.classList.add("personagem");

        const img = document.createElement("img");
        img.src = personagem.image;
        img.alt = personagem.name;

        const name = document.createElement("p");
        name.textContent = personagem.name;

        const favBtn = document.createElement("button");
        favBtn.textContent = "Favoritar";
        favBtn.addEventListener("click", () => {
            favPersonagem(personagem);
        });

        img.addEventListener("click", () => {
            exibirInfo(personagem);
        });

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(favBtn);

        listaPersonagensDiv.appendChild(div);
    });
}

function favPersonagem(personagem) {
    if (!favoritos.some(f => f.id === personagem.id)) {
        favoritos.push(personagem);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        window.alert(`${personagem.name} foi adicionado aos favoritos!`);
    } 
    else {
        window.alert(`${personagem.name} já está nos favoritos.`);
    }
}

function removerFavorito(personagem) {
    favoritos = favoritos.filter(f => f.id !== personagem.id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    exibirFavoritos();
}

function exibirFavoritos() {
    listaFavoritosDiv.innerHTML = "";
    if (favoritos.length === 0) {
        listaFavoritosDiv.innerHTML = "<p>Nenhum favorito encontrado.</p>";
    } else {
        favoritos.forEach(personagem => {
            const div = document.createElement("div");
            div.classList.add("favorito");

            const img = document.createElement("img");
            img.src = personagem.image;
            img.alt = personagem.name;

            const name = document.createElement("p");
            name.textContent = personagem.name;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remover";
            removeBtn.addEventListener("click", () => {
                removerFavorito(personagem);
            });

            div.appendChild(img);
            div.appendChild(name);
            div.appendChild(removeBtn);
            listaFavoritosDiv.appendChild(div);
        });
    }
    listaFavoritosDiv.style.display = "flex"; 
    listaPersonagensDiv.style.display = "none";
}

function exibirInfo(personagem) {
    const infoPersonagem = `
        Nome: ${personagem.name}
        Status: ${personagem.status}
        Espécie: ${personagem.species}
        Gênero: ${personagem.gender}
        Localização: ${personagem.location.name}
        Origem: ${personagem.origin.name}
    `;
    window.alert(infoPersonagem);
}

async function pesquisarPersonagem() {
    const pesquisa = inputPesquisa.value.trim();
    if (pesquisa) {
        try {
            const id = parseInt(pesquisa, 10);
            const response = await fetch(`${url}/${id}`);
            if (response.ok) {
                const personagem = await response.json();
                exibirPersonagens([personagem]);
            } else {
                const allResponse = await fetch(url);
                const allData = await allResponse.json();
                const personagemNome = allData.results.filter(p => p.name.toLowerCase().includes(pesquisa.toLowerCase()));
                exibirPersonagens(personagemNome.slice(0, 100));
            }
        } catch (error) {
            console.error("Erro ao pesquisar personagem:", error);
        }
    } else {
        alert("Por favor, insira um nome ou ID para pesquisa.");
    }
}

function inicio() {
    listaPersonagensDiv.innerHTML = "";
    listaFavoritosDiv.innerHTML = "";
    listaFavoritosDiv.style.display = "none";
    listaPersonagensDiv.style.display = "flex";
    fetchAllPersonagens();
}

btnInicio.addEventListener("click", inicio);
btnFavoritos.addEventListener("click", exibirFavoritos);
btnPesquisar.addEventListener("click", pesquisarPersonagem);

fetchAllPersonagens();