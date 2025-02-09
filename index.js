const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/location', async (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (
    ip === '::1' ||
    ip === '127.0.0.1' ||
    (typeof ip === 'string' && ip.startsWith('::ffff:127.0.0.1'))
  ) {
    ip = '8.8.8.8'; // IP para testes locais
  }
  try {
    // Corrigido para usar template literal corretamente
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const locationData = response.data;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Sua Localização</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f0f2f5; color: #333; }
            .container { max-width: 600px; margin: 2rem auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #3498db; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 0.5rem; border: 1px solid #ddd; }
            th { background: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Sua Localização</h1>
            <table>
              <tr><th>Campo</th><th>Valor</th></tr>
              <tr><td>IP</td><td>${locationData.ip || ip}</td></tr>
              <tr><td>Cidade</td><td>${locationData.city || 'Não disponível'}</td></tr>
              <tr><td>Região</td><td>${locationData.region || 'Não disponível'}</td></tr>
              <tr><td>País</td><td>${locationData.country_name || 'Não disponível'}</td></tr>
              <tr><td>Latitude</td><td>${locationData.latitude || 'Não disponível'}</td></tr>
              <tr><td>Longitude</td><td>${locationData.longitude || 'Não disponível'}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Erro ao buscar localização:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Erro ao buscar localização' });
  }
});

// Use '0.0.0.0' para que o Render possa acessar sua aplicação
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
