document.getElementById("downloadBtn").addEventListener("click", async function() {
    const url = document.getElementById("urlInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");
    const loading = document.getElementById("loading");

    if (!url) {
        alert("Silakan masukkan URL TikTok terlebih dahulu.");
        return;
    }

    loading.style.display = "block";
    resultContainer.innerHTML = "";

    try {
        const response = await fetch("http://localhost:3000/tiktok", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        loading.style.display = "none";

        if (!data || !data.video_no_watermark) {
            resultContainer.innerHTML = "<p>Gagal mendapatkan video. Coba lagi!</p>";
            return;
        }

        resultContainer.innerHTML = `
            <div class="result-item">
                <h3>Hasil:</h3>
                <video controls width="100%">
                    <source src="${data.video_no_watermark}" type="video/mp4">
                </video>
                <a href="${data.video_no_watermark}" download>Download Tanpa Watermark</a>
                <a href="${data.video_watermark}" download>Download Dengan Watermark</a>
                <a href="${data.audio}" download>Download Audio</a>
            </div>
        `;
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        loading.style.display = "none";
        resultContainer.innerHTML = "<p>Terjadi kesalahan. Coba lagi nanti.</p>";
    }
});