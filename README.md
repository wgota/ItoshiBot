<p align="center">
<img height="250" src="https://i.imgur.com/eTs66Hm.png" align="right">

# Itoshi Bot
## Bot de Discord com sistemas para MTA, moderação, diversão e outros.

- Compatibilidade com: MongoDB e MYSQL.
 
 - Nossos comandos:
 
    ・WhiteList (Necessário ter banco de dados em MySQL) [Em breve...];
  
    ・Sugestão;

    ・Log de mensagem e calls;
  
    ・Sistema de moderação;
  
    ・Sistema de suporte;

    ・Comandos utilitários;

    ・Sistema entrada e saída.


## Configurações
### Instalando pacotes
> Se você não tiver node instalado, [clique aqui](https://nodejs.org/en/).
```
npm install
```

> Crie um arquivo com o nome `config.json` e complete as informações como o modelo abaixo
```json
{
    "token": "token do bot",
    "clientId": "id do bot",
    "guildId": "id do servidor",
    "color": "cor padrão da embed",
    "databaseURI": "url de conexão do mongo",
    "ownerId": "seu id aqui"
}
```
