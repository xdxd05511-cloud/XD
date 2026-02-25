const express = require('express');
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot ordusu güncellendi: Çoklu Kanal + Tek Mesaj Aktif!");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor.`);
});

// Değişkenleri Render'dan çekiyoruz
const tokensRaw = process.env.TOKENS; 
const channelIdsRaw = process.env.CHANNEL_IDS; 
const message = process.env.MESSAGE;

if (!tokensRaw || !channelIdsRaw || !message) {
    console.error("HATA: Environment (TOKENS, CHANNEL_IDS veya MESSAGE) eksik!");
} else {
    // Virgülle ayrılmış metinleri listeye çeviriyoruz
    const tokens = tokensRaw.split(",").map(t => t.trim());
    const channelIds = channelIdsRaw.split(",").map(c => c.trim());

    // Her 20 saniyede bir döngü başlar (Hız sınırı için süreyi biraz açtık)
    setInterval(() => {
        tokens.forEach((token, index) => {
            // Her hesap arasına 1.5 saniye fark koyarak gönderiyoruz
            setTimeout(() => {
                // 3 kanaldan birini rastgele seçiyoruz
                const randomChannel = channelIds[Math.floor(Math.random() * channelIds.length)];
                
                sendMessage(token, randomChannel, message);
            }, index * 1500); 
        });
    }, 20000); 
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
    console.log(`✅ Mesaj Gönderildi | Kanal: ${channelId} | Token: ${token.substring(0, 10)}...`);
  }).catch((err) => {
    console.error(`❌ Hata Oluştu (${err.response?.status}) | Kanal: ${channelId}`);
  });
}
