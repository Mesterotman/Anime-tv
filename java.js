// عناصر HTML
const animeList = document.getElementById("anime-list");
const searchInput = document.getElementById("search");
const backButton = document.getElementById("back-button");

// جلب قائمة الأنميات من Jikan API
async function fetchAnimes(query = "") {
    try {
        const url = query
            ? `https://api.jikan.moe/v4/anime?q=${query}`
            : "https://api.jikan.moe/v4/top/anime";
        const response = await fetch(url);
        const data = await response.json();
        displayAnimes(data.data);
        backButton.style.display = "none"; // إخفاء زر الرجوع
    } catch (error) {
        console.error("Error fetching anime:", error);
    }
}

// عرض قائمة الأنميات
function displayAnimes(animeData) {
    animeList.innerHTML = "";
    animeData.forEach((anime) => {
        const animeCard = document.createElement("div");
        animeCard.className = "anime-card";
        animeCard.innerHTML = `
            <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
            <h3>${anime.title}</h3>
            <button onclick="viewDetails(${anime.mal_id})">التفاصيل</button>
            <button onclick="viewEpisodes(${anime.mal_id})">الحلقات</button>
        `;
        animeList.appendChild(animeCard);
    });
}

// عرض تفاصيل الأنمي
async function viewDetails(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        const anime = data.data;

        animeList.innerHTML = `
            <div class="anime-details">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <h2>${anime.title}</h2>
                <p>${anime.synopsis || "لا توجد تفاصيل متوفرة."}</p>
                <p><strong>التقييم:</strong> ${anime.score || "غير متوفر"}</p>
                <p><strong>عدد الحلقات:</strong> ${anime.episodes || "غير محدد"}</p>
            </div>
        `;

        backButton.style.display = "inline-block"; // عرض زر الرجوع
    } catch (error) {
        console.error("Error fetching anime details:", error);
    }
}

// عرض قائمة الحلقات
async function viewEpisodes(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
        const data = await response.json();
        const episodes = data.data;

        animeList.innerHTML = `
            <h2>قائمة الحلقات</h2>
            <ul id="episode-list">
                ${
                    episodes.length > 0
                        ? episodes.map((episode) =>
                              `<li>
                                <span>${episode.title || "حلقة غير مسماة"}</span>
                                <button onclick="watchEpisode('${episode.url}')">مشاهدة</button>
                              </li>`
                          ).join("")
                        : "<p>لا توجد حلقات متوفرة.</p>"
                }
            </ul>
        `;

        backButton.style.display = "inline-block"; // عرض زر الرجوع
    } catch (error) {
        console.error("Error fetching episodes:", error);
    }
}

// وظيفة مشاهدة الحلقة
function watchEpisode(url) {
    window.open(url, "_blank");
}

// وظيفة زر الرجوع
backButton.addEventListener("click", () => {
    fetchAnimes(); // إعادة عرض القائمة
});

// البحث عن أنمي عند إدخال النص في مربع البحث
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    fetchAnimes(query);
});

// جلب الأنميات الشائعة عند بدء التشغيل
fetchAnimes();