import React, { useState, useEffect } from 'react';
import styles from '../Consulta/Consulta.module.css'; // Importa o CSS como um módulo

function App3() {
    // Estado para armazenar a cidade digitada pelo usuário
    const [cidade, setCidade] = useState('');
    // Estado para armazenar os resultados da busca de clima
    const [clima, setClima] = useState([]);
    // Estado para armazenar todos os dados do clima disponíveis
    const [dadosClima, setDadosClima] = useState([]);

    // useEffect para buscar os dados do JSON quando o componente for montado
    useEffect(() => {
        const buscarDadosClima = async () => {
            try {
                // Faz uma solicitação para buscar o arquivo JSON com os dados do clima
                const resposta = await fetch('/weatherData.json');
                // Converte a resposta para JSON
                const dados = await resposta.json();
                // Atualiza o estado com os dados do clima obtidos
                setDadosClima(dados.weather_data);
            } catch (erro) {
                // Exibe um erro no console se a solicitação falhar
                console.error('Falha ao buscar os dados do clima:', erro);
            }
        };

        // Chama a função para buscar os dados
        buscarDadosClima();
    }, []); // O array vazio significa que o useEffect será executado apenas uma vez, quando o componente for montado

    // Função para lidar com a busca quando o botão é clicado
    const pesquisar = () => {
        // Obtém o termo de busca, removendo espaços extras e convertendo para minúsculas
        //O método trim() é uma função em JavaScript que remove espaços em branco do início e do final de uma string. Ele não altera os espaços em branco dentro da string. const texto = '   Olá, Mundo!   ';
        const termoBusca = cidade.trim().toLowerCase();
        // Se o termo de busca estiver vazio, limpa o estado de 'clima' e retorna
        if (termoBusca === '') {
            setClima([]);
            return;
        }

        // Filtra os dados para encontrar cidades que contêm o termo de busca
        const resultados = dadosClima.filter((dados) =>
            dados.city.toLowerCase().includes(termoBusca)
        );

        // Atualiza o estado com os resultados encontrados
        setClima(resultados);
    };

    return (
        <div className={styles.container}>
            <h1>Aplicativo de Clima</h1>
            <div className={styles.searchContainer}>
                <input
                    className={styles.input}
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Digite o nome da cidade"
                />
                <button className={styles.button} onClick={pesquisar}>
                    Buscar
                </button>
            </div>

            {/* Exibe uma mensagem de erro se não houver resultados e se o campo da cidade não estiver vazio */}
            {clima.length === 0 && cidade && (
                <p className={styles.error}>Nenhuma cidade encontrada</p>
            )}

            {/* Mapeia cada item na lista de 'clima' e renderiza um componente para cada um */}
            {clima.map((dados) => (
                // Para cada item 'dados' na lista 'clima', cria um novo <div> com uma chave única
                <div key={dados.city} className={styles.weatherContainer}>
                    {/* Exibe o nome da cidade e o país como um título */}
                    <h2>
                        {dados.city}, {dados.country}
                    </h2>
                    {/* Exibe a temperatura atual, formatada com a unidade Celsius (°C) */}
                    <p className={styles.temperature}>{dados.temperature}°C</p>
                    {/* Exibe a condição climática, como "ensolarado", "nublado", etc. */}
                    <p>{dados.condition}</p>
                    {/* Exibe um ícone que representa o clima atual */}
                    <div className={styles.icon}>{dados.icon}</div>
                </div>
            ))}
        </div>
    );
}

export default App3;
