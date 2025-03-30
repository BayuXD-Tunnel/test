const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

async function video(url) {
    try {
        const { data: html } = await axios({
            url: "https://ttsave.app/download",
            method: "post",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
                "Referer": "https://ttsave.app/id",
            },
            data: { query: url },
        });

        const $ = cheerio.load(html);
        return {
            video_no_watermark: $('a[type="no-watermark"]').attr("href") || null,
            video_watermark: $('a[type="watermark"]').attr("href") || null,
            audio: $('a[type="audio"]').attr("href") || null,
            profile_picture: $('a[type="profile"]').attr("href") || null,
            video_cover: $('a[type="cover"]').attr("href") || null,
        };
    } catch (error) {
        console.error("Error fetching TikTok video:", error.message);
        return null;
    }
}

app.post("/tiktok", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL tidak boleh kosong" });

    const result = await video(url);
    if (!result) return res.status(500).json({ error: "Gagal mengambil data" });

    res.json(result);
});

app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});