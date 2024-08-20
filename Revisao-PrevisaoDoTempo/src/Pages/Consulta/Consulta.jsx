import React, { useState, useEffect } from 'react'; // Importa o React e os hooks useState e useEffect
import styles from './Consulta.module.css'; // Importa o CSS como um módulo, para estilização com escopo local

// Define o componente funcional App
function App() {
  // Define o estado para a cidade digitada pelo usuário
  const [cidade, setCidade] = useState('');
  // Define o estado para armazenar as informações do tempo para a cidade pesquisada
  const [clima, setClima] = useState(null);
  // Define o estado para armazenar mensagens de erro
  const [erro, setErro] = useState('');
  // Define o estado para armazenar todos os dados do tempo disponíveis
  const [dadosClima, setDadosClima] = useState([]);

  // useEffect para buscar os dados do JSON quando o componente for montado
  useEffect(() => {
    // Função assíncrona para buscar os dados do JSON
    const buscarDadosClima = async () => {
      try {
        // Faz uma solicitação para buscar o arquivo JSON com os dados do tempo
        const resposta = await fetch('/weatherData.json');
        // Converte a resposta para JSON
        const dados = await resposta.json();
        // Atualiza o estado com os dados do tempo obtidos
        setDadosClima(dados.weather_data);
      } catch (erro) {
        // Caso ocorra um erro na busca, exibe o erro no console e define uma mensagem de erro
        console.error('Falha ao buscar os dados do clima:', erro);
        setErro('Falha ao carregar os dados do clima');
      }
    };

    buscarDadosClima(); // Chama a função para buscar os dados
  }, []); // O array vazio significa que o useEffect será executado apenas uma vez, quando o componente for montado

  // Função para lidar com a busca quando o usuário clica no botão de busca
  const lidarBusca = () => {
    // Obtém o termo de busca, removendo espaços extras e convertendo para minúsculas
    const termoBusca = cidade.trim().toLowerCase();
    // Se o termo de busca estiver vazio, limpa o estado e retorna
    if (termoBusca === '') {
      setClima(null);
      setErro('');
      return;
    }

    // Filtra os dados para encontrar cidades que contêm o termo de busca no nome
    const resultados = dadosClima.filter((dados) =>
      dados.city.toLowerCase().includes(termoBusca)
    );

    // Atualiza o estado com os resultados encontrados ou define uma mensagem de erro se nenhum resultado for encontrado
    if (resultados.length > 0) {
      setClima(resultados);
      setErro('');
    } else {
      setClima([]);
      setErro('Nenhuma cidade encontrada');
    }
  };

  // useEffect para limpar os resultados e mensagens de erro quando o campo da cidade é apagado
  useEffect(() => {
    if (cidade === '') {
      setClima(null);
      setErro('');
    }
  }, [cidade]); // O useEffect será executado sempre que o valor de `cidade` mudar

  // Renderiza a interface do usuário
  return (
    <div className={styles.container}>
      <h1>Aplicativo de Clima</h1>
      <div className={styles.searchContainer}>
        <input
          className={styles.input}
          type="text"
          value={cidade} 
          onChange={(e) => setCidade(e.target.value)} // Atualiza o estado `cidade` com o valor do campo de entrada
          placeholder="Digite o nome da cidade"
        />
        <button className={styles.button} onClick={lidarBusca}>
          Buscar
        </button>
      </div>

      {erro && <p className={styles.error}>{erro}</p>} {/* Exibe a mensagem de erro se houver uma */}

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

// Exporta o componente App para ser usado em outros arquivos
export default App;
