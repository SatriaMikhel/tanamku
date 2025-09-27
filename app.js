// ===== Routing sederhana =====
const routes = [...document.querySelectorAll('[data-route]')];
const tabButtons = [...document.querySelectorAll('.tabbar button')];
function show(route){
  routes.forEach(r => r.classList.remove('active'));
  document.getElementById(route).classList.add('active');
  tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab===route));
  window.scrollTo({top:0, behavior:'smooth'});
}
tabButtons.forEach(b=> b.addEventListener('click', ()=> show(b.dataset.tab)));
document.querySelectorAll('[data-goto]')
  .forEach(btn=> btn.addEventListener('click', ()=> show(btn.dataset.goto)));

// ===== Berita (ambil dari news.json lokal) =====
let NEWS = [];
async function fetchNewsLocal(){
  try{
    const r = await fetch('./news.json');
    if(!r.ok) throw new Error('news.json not found');
    const data = await r.json();
    NEWS = Array.isArray(data) ? data : [];
    renderNewsHome(NEWS);
    renderNewsList(NEWS);
  }catch(e){
    const fallback = [{id:'0', t:"Tidak bisa memuat berita", d:"Coba refresh halaman", url:"#"}];
    NEWS = fallback;
    renderNewsHome(NEWS);
    renderNewsList(NEWS);
  }
}
function renderNewsHome(list){
  // tampilkan 3 terbaru di beranda
  const box = document.getElementById('newsListHome');
  if(!box) return;
  const items = (list || []).slice(0,3);
  box.innerHTML = items.map(n => `
    <a href="#" class="card news-link" data-id="${n.id||''}">
      ${n.img ? `<img class="thumb" src="${n.img}" alt="${n.t}">` : '' }
      <strong>${n.t}</strong>
      <p class="muted">${n.d||''}</p>
      ${n.date || n.author ? `<div class="meta">${n.date? n.date:''}${n.date&&n.author?' • ':''}${n.author? n.author:''}</div>`:''}
    </a>
  `).join('');
}
function renderNewsList(list){
  // daftar penuh di menu Berita
  const box = document.getElementById('newsListFull');
  if(!box) return;
  box.innerHTML = (list || []).map(n => `
    <a href="#" class="card news-link" data-id="${n.id||''}">
      ${n.img ? `<img class="thumb" src="${n.img}" alt="${n.t}">` : '' }
      <strong>${n.t}</strong>
      <p class="muted">${n.d||''}</p>
      ${n.date || n.author ? `<div class="meta">${n.date? n.date:''}${n.date&&n.author?' • ':''}${n.author? n.author:''}</div>`:''}
    </a>
  `).join('');
}
// event delegation untuk klik item berita (beranda & list)
document.addEventListener('click', (e)=>{
  const link = e.target.closest('.news-link');
  if(link){
    e.preventDefault();
    const id = link.dataset.id || '';
    const item = NEWS.find(x => String(x.id) === String(id)) || null;
    if(item) {
      renderNewsDetail(item);
      show('beritaDetail');
    }
  }
});
function renderNewsDetail(n){
  const card = document.getElementById('newsDetailCard');
  if(!card) return;
  const contentHtml = Array.isArray(n.content)
    ? n.content.map(p => `<p>${p}</p>`).join('')
    : (n.content || `<p>${n.d||''}</p>`);
  card.innerHTML = `
    ${n.img ? `<img class="thumb" src="${n.img}" alt="${n.t}" style="margin-bottom:10px">` : '' }
    <div class="detail">
      <h1>${n.t}</h1>
      ${n.date || n.author ? `<div class="meta">${n.date? n.date:''}${n.date&&n.author?' • ':''}${n.author? n.author:''}</div>`:''}
      ${contentHtml}
      ${n.url && n.url !== '#' ? `<p><a href="${n.url}" target="_blank" rel="noopener">Sumber asli ↗</a></p>` : '' }
    </div>
  `;
}
document.getElementById('backToNews')?.addEventListener('click', ()=> show('berita'));

// panggil saat load
fetchNewsLocal();

// ===== Panduan Soil & Hidro =====
const soilGuides = [
  {
    title: "Cabai di Pot (7 langkah)",
    steps: [
      "Pot Ø 25–30 cm, drainase bagus",
      "Media 50% tanah, 30% kompos, 20% sekam",
      "Semaikan 7–10 hari, pindah saat 3–4 daun",
      "Siram pagi/sore, hindari becek",
      "Pupuk ringan tiap 2 minggu",
      "Cek hama—gunakan neem/sabun lembut",
      "Panen 75–90 HST saat merah"
    ]
  },
  {
    title: "Tomat di Pot (6 langkah)",
    steps: [
      "Pot Ø ≥ 30 cm + ajir/tali",
      "Media gembur (tanah+kompos+sekam)",
      "Pindah saat 4–5 daun",
      "Siram teratur, jangan kena daun",
      "Pupuk K tinggi saat pembungaan",
      "Panen 60–80 HST saat merah"
    ]
  }
];
const hidroGuides = [
  {
    title: "Kangkung Sistem Wick",
    steps: [
      "Wadah nutrisi + sumbu kain (wick)",
      "Rockwool 2×2 cm, 3–4 benih/balok",
      "Nutrisi 800–1000 ppm",
      "Cahaya 4–6 jam/hari",
      "Isi ulang nutrisi tiap 7–10 hari",
      "Panen 20–25 HSS"
    ]
  },
  {
    title: "Selada NFT (pemula)",
    steps: [
      "Pipa/NFT tray + pompa kecil",
      "pH 5.8–6.2, EC 0.8–1.2",
      "Cahaya 6–8 jam/hari",
      "Jaga akar bersih & aliran lancar",
      "Panen 35–45 HSS"
    ]
  }
];
const listSoil = document.getElementById('listSoil');
const listHidro = document.getElementById('listHidro');
function renderGuide(targetEl, guides) {
  targetEl.innerHTML = guides.map(g => `
    <article class="card">
      <h3>${g.title}</h3>
      <ol>${g.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    </article>
  `).join('');
}
if (listSoil && listHidro) {
  renderGuide(listSoil, soilGuides);
  renderGuide(listHidro, hidroGuides);
  const tabBtns = document.querySelectorAll('.tab');
  tabBtns.forEach(btn => btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const pan = btn.dataset.pan;
    if (pan === 'soil') {
      listSoil.style.display = '';
      listHidro.style.display = 'none';
    } else {
      listSoil.style.display = 'none';
      listHidro.style.display = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
}

// ===== Kamus =====
const istilah = [
  {k:'pH tanah', d:'Derajat keasaman tanah; ideal sayuran umumnya 5.5–6.8.'},
  {k:'NPK', d:'Nitrogen-Phosphorus-Potassium; unsur hara makro utama.'},
  {k:'Mulsa', d:'Penutup permukaan tanah (jerami/plastik) untuk jaga lembab & cegah gulma.'},
  {k:'Media tanam', d:'Campuran bahan tempat akar tumbuh (tanah, kompos, sekam, cocopeat, dsb).'},
  {k:'HST', d:'Hari Setelah Tanam/Tabur; patokan umur tanaman.'},
  {k:'EC/PPM', d:'Kadar/konsentrasi nutrisi pada sistem hidroponik.'}
];
const list = document.getElementById('kamusList');
function renderKamus(data){
  list.innerHTML = data.map(it => `
    <details class="term"><summary>${it.k}</summary><p>${it.d}</p></details>
  `).join('');
}
renderKamus(istilah);
const q = document.getElementById('q');
document.getElementById('btnCari').addEventListener('click', ()=>{
  const s = (q.value||'').toLowerCase();
  const f = istilah.filter(it=> it.k.toLowerCase().includes(s) || it.d.toLowerCase().includes(s));
  renderKamus(f);
});
q.addEventListener('keyup', (e)=>{ if(e.key==='Enter') document.getElementById('btnCari').click(); });

// ===== Kalkulator Panen =====
const faktor = { cabai: 0.25, tomat: 0.8, kangkung: 0.15 }; // kg/pot/siklus (demo)
const btnHitung = document.getElementById('hitung');
if(btnHitung){
  btnHitung.addEventListener('click', ()=>{
    const t = document.getElementById('tanaman').value;
    const j = Math.max(1, parseInt(document.getElementById('jumlah').value||'1',10));
    const total = (faktor[t] * j).toFixed(2);
    document.getElementById('hasil').textContent = `Perkiraan panen: ${total} kg/siklus (estimasi sederhana)`;
  });
}

// ===== Kuis =====
const btnKuis = document.getElementById('cekKuis');
if(btnKuis){
  btnKuis.addEventListener('click', ()=>{
    const a1 = (document.querySelector('input[name=q1]:checked')||{}).value;
    const a2 = (document.querySelector('input[name=q2]:checked')||{}).value;
    let skor = 0; if(a1==='B') skor+=50; if(a2==='B') skor+=50;
    document.getElementById('skor').textContent = `Nilai kamu: ${skor}/100`;
  });
}

// ===== Widget Cuaca (OpenWeatherMap - FRONTEND) =====
const OWM_API_KEY = "7f3397bd2b18e7cdaf2dc2e9b82d439a"; // API key kamu
const citySelect = document.getElementById('citySelect');
const weatherBox = document.getElementById('weatherBox');

async function fetchWeather(city) {
  try {
    const api = 'https://api.openweathermap.org/data/2.5/weather';
    const url = `${api}?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&units=metric&lang=id`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal ambil cuaca');
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const descRaw = data.weather?.[0]?.description || '';
    const desc = descRaw.replace(/\b\w/g, c => c.toUpperCase());

    // Tampilkan
    weatherBox.innerHTML = `
      <div class="big">${temp}°C</div>
      <div class="muted">${desc}</div>
    `;

    // Cache 15 menit
    const key = `wx_${city}`;
    localStorage.setItem(key, JSON.stringify({ time: Date.now(), data: { temp, desc } }));
  } catch (e) {
    // Fallback: coba cache
    const key = `wx_${city}`;
    const cached = JSON.parse(localStorage.getItem(key) || "null");
    if (cached && Date.now() - cached.time < 15 * 60 * 1000) {
      weatherBox.innerHTML = `
        <div class="big">${cached.data.temp}°C</div>
        <div class="muted">${cached.data.desc}</div>
      `;
    } else {
      weatherBox.innerHTML = `
        <div class="big">--°C</div>
        <div class="muted">Tidak bisa memuat cuaca</div>
      `;
    }
  }
}

// Inisialisasi cuaca
if (citySelect && weatherBox) {
  fetchWeather(citySelect.value);
  citySelect.addEventListener('change', () => fetchWeather(citySelect.value));
}
