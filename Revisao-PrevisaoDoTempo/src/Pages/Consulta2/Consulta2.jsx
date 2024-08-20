import React, { useState, useEffect } from 'react';
import styles from '../Consulta/Consulta.module.css'; // Importa o CSS como um módulo para estilização com escopo local

function App2() {
    const [cidade, setCidade] = useState(''); // Estado para armazenar a cidade digitada
    const [clima, setClima] = useState(null); // Estado para armazenar as informações do clima
    const [erro, setErro] = useState(''); // Estado para armazenar mensagens de erro
    const [dadosClima, setDadosClima] = useState([]); // Estado para armazenar todos os dados do clima

    // useEffect para buscar dados e realizar a busca quando a cidade muda
    useEffect(() => {
        // Função assíncrona para buscar os dados do JSON
        const buscarDadosClima = async () => {
            try {
                const resposta = await fetch('/weatherData.json'); // Faz uma solicitação para buscar o arquivo JSON
                const dados = await resposta.json(); // Converte a resposta para JSON
                setDadosClima(dados.weather_data); // Atualiza o estado com os dados do clima obtidos
            } catch (erro) {
                console.error('Falha ao buscar os dados do clima:', erro); // Exibe erro no console se a busca falhar
                setErro('Falha ao carregar os dados do clima'); // Define uma mensagem de erro
            }
        };

        buscarDadosClima(); // Chama a função para buscar dados

        // Lógica de busca e atualização de estados
        if (cidade.trim() === '') { // Se o campo de cidade estiver vazio
            setClima(null); // Limpa o estado do clima
            setErro(''); // Limpa a mensagem de erro
            return; // Sai da função
        }

        // Filtra as cidades que correspondem exatamente ao termo de busca
        const resultados = dadosClima.filter((dados) =>
            dados.city === cidade.trim()
        );

        if (resultados.length > 0) {
            setClima(resultados); // Atualiza o estado com os resultados encontrados
            setErro(''); // Limpa a mensagem de erro
        } else {
            setClima([]); // Limpa o estado do clima
            setErro('Nenhuma cidade encontrada'); // Define uma mensagem de erro se nenhum resultado for encontrado
        }

    }, [cidade, dadosClima]); // Executa sempre que `cidade` ou `dadosClima` muda

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
            </div>

            {erro && <p className={styles.error}>{erro}</p>} {/* Exibe a mensagem de erro se houver */}

            {clima && Array.isArray(clima) && clima.length > 0 && (
                <div>
                    {clima.map((dados) => (
                        <div key={dados.city} className={styles.weatherContainer}>
                            <h2>
                                {dados.city}, {dados.country}
                            </h2>
                            <p className={styles.temperature}>{dados.temperature}°C</p>
                            <p>{dados.condition}</p>
                            <div className={styles.icon}>{dados.icon}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App2;
