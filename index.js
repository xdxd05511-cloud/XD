const express = require('express');
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot ordusu senkronize şekilde çalışıyor!");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda aktif.`);
});

// Değişkenleri alıyoruz
const tokensRaw = process.env.TOKENS; 
const channelIdsRaw = process.env.CHANNEL_IDS; 
const message = process.env.MESSAGE;

if (!tokensRaw || !channelIdsRaw || !message) {
    console.error("HATA: Değişkenler eksik!");
} else {
    const tokens = tokensRaw.split(",").map(t => t.trim());
    const channelIds = channelIdsRaw.split(",").map(c => c.trim());

    // Ana döngü: Her 5 saniyede bir bu süreci başlatır
    setInterval(() => {
        tokens.forEach((token, index) => {
            // Her hesap arasına 300ms (0.3s) gecikme koyuyoruz
            setTimeout(() => {
                // Kanallar arasından rastgele birini seç (%33 ihtimalle biri)
                const randomChannel = channelIds[Math.floor(Math.random() * channelIds.length)];
                
                sendMessage(token, randomChannel, message);
            }, index * 300); // 1. hesap 0ms, 2. hesap 300ms, 3. hesap 600ms...
        });
    }, 5000); 
}

function sendMessage(token, channelId, message) {
  axios.post(`https://discord.com/api/v9/channels/${channelId}/messages`, {
    content: message
  }, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    }
  }).then(() => {
    console.log(`✅ Hesap[${token.substring(0,5)}] -> Kanal[${channelId}]`);
  }).catch((err) => {
    console.error(`❌ Hata: ${err.response?.status}`);
  });
}
