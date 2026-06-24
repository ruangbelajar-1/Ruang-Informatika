/* ============================================ */
/* GAME.JS - Logika Game Edukasi Informatika    */
/* ============================================ */

document.addEventListener("DOMContentLoaded", function () {

    // ============================================
    // DATA SISWA & STATE
    // ============================================
    let siswa = { nama: "", kelas: "" };
    let gameAktif = null; // 'quiz' | 'dragdrop' | 'cyber'

    const gameListSection = document.getElementById("daftar-game");
    const gameArea = document.getElementById("gameArea");
    const gameContent = document.getElementById("gameContent");
    const identitasModalEl = document.getElementById("identitasModal");
    const identitasModal = new bootstrap.Modal(identitasModalEl);
    const formIdentitas = document.getElementById("formIdentitas");
    const btnKembaliDaftar = document.getElementById("btnKembaliDaftar");

    // Tombol "Mainkan" pada tiap card
    document.querySelectorAll(".btn-mainkan").forEach(btn => {
        btn.addEventListener("click", function () {
            gameAktif = this.dataset.game;
            identitasModal.show();
        });
    });

    // Submit form identitas -> mulai game
    formIdentitas.addEventListener("submit", function (e) {
        e.preventDefault();
        siswa.nama = document.getElementById("inputNama").value.trim();
        siswa.kelas = document.getElementById("inputKelas").value.trim();

        if (!siswa.nama || !siswa.kelas) return;

        identitasModal.hide();
        gameListSection.classList.add("d-none");
        gameArea.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (gameAktif === "quiz") mulaiQuiz();
        else if (gameAktif === "dragdrop") mulaiDragDrop();
        else if (gameAktif === "cyber") mulaiCyber();
    });

    // Tombol kembali ke daftar game
    btnKembaliDaftar.addEventListener("click", function () {
        gameArea.classList.add("d-none");
        gameListSection.classList.remove("d-none");
        gameContent.innerHTML = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ============================================
    // FUNGSI UMUM: TAMPILKAN HASIL AKHIR
    // ============================================
    function tampilkanHasil(namaGame, benar, salah, total) {
        const skor = benar * 10;
        let pesan = "";
        const persentase = (benar / total) * 100;

        if (persentase >= 90) pesan = "Luar biasa! Kamu sudah sangat menguasai materi ini. 🎉";
        else if (persentase >= 70) pesan = "Bagus! Pemahamanmu sudah baik, terus tingkatkan. 👍";
        else if (persentase >= 50) pesan = "Cukup baik, tapi masih perlu belajar lagi ya. 💪";
        else pesan = "Jangan menyerah! Pelajari kembali materinya dan coba lagi. 🔥";

        gameContent.innerHTML = `
            <div class="game-result">
                <div class="score-circle">${skor}</div>
                <h4 class="fw-bold mb-2">${namaGame}</h4>
                <p class="text-muted mb-3">${pesan}</p>
                <div class="row text-center mb-4">
                    <div class="col-6">
                        <h5 class="fw-bold text-success mb-0">${benar}</h5>
                        <small class="text-muted">Benar</small>
                    </div>
                    <div class="col-6">
                        <h5 class="fw-bold text-danger mb-0">${salah}</h5>
                        <small class="text-muted">Salah</small>
                    </div>
                </div>
                <button class="btn btn-primary rounded-pill px-4 fw-bold" id="btnSelesaiHasil">
                    <i class="fas fa-list me-2"></i>Kembali ke Daftar Game
                </button>
            </div>
        `;

        document.getElementById("btnSelesaiHasil").addEventListener("click", function () {
            btnKembaliDaftar.click();
        });

        // Kirim ke Google Sheets
        kirimNilaiKeSheet({
            nama: siswa.nama,
            kelas: siswa.kelas,
            game: namaGame,
            skor: skor,
            benar: benar,
            salah: salah
        });
    }

    // ============================================================
    // GAME 1: QUIZ BATTLE INFORMATIKA
    // ============================================================
    const soalQuiz = [
        { soal: "Apa yang dimaksud dengan phishing?", opsi: ["Teknik memancing ikan di internet", "Upaya menipu untuk mencuri data pribadi melalui pesan/situs palsu", "Jenis virus yang merusak hardware", "Aplikasi untuk mengamankan akun"], jawaban: 1 },
        { soal: "Ciri umum email phishing adalah...", opsi: ["Dikirim dari domain resmi perusahaan", "Meminta klik link mencurigakan dengan urgensi tinggi", "Tidak meminta data apapun", "Selalu memiliki tanda tangan digital resmi"], jawaban: 1 },
        { soal: "Password yang aman sebaiknya...", opsi: ["Menggunakan tanggal lahir", "Sama untuk semua akun agar mudah diingat", "Kombinasi huruf besar, kecil, angka, dan simbol", "Hanya terdiri dari angka"], jawaban: 2 },
        { soal: "Apa fungsi autentikasi dua faktor (2FA)?", opsi: ["Mempercepat login", "Menambah lapisan keamanan selain password", "Mengganti password secara otomatis", "Menghapus akun yang tidak aktif"], jawaban: 1 },
        { soal: "Privasi digital berkaitan dengan...", opsi: ["Kecepatan internet", "Kontrol seseorang atas data pribadinya di dunia maya", "Jumlah followers di media sosial", "Desain tampilan aplikasi"], jawaban: 1 },
        { soal: "Tindakan yang TIDAK aman saat berinternet adalah...", opsi: ["Memeriksa URL sebelum klik", "Membagikan password ke teman", "Menggunakan password berbeda tiap akun", "Mengaktifkan 2FA"], jawaban: 1 },
        { soal: "Jika menerima pesan menang hadiah tanpa ikut undian, sebaiknya...", opsi: ["Klik link untuk klaim hadiah", "Balas dengan data pribadi", "Curigai sebagai penipuan dan jangan klik", "Teruskan ke semua teman"], jawaban: 2 },
        { soal: "Data pribadi yang harus dijaga kerahasiaannya, kecuali...", opsi: ["Nomor KTP", "Password akun", "Nama sekolah (info umum)", "PIN ATM"], jawaban: 2 },
        { soal: "Salah satu cara mencegah phishing adalah...", opsi: ["Mengabaikan update keamanan", "Memverifikasi pengirim dan alamat situs resmi", "Menggunakan WiFi publik tanpa VPN untuk transaksi", "Mengklik semua link yang dikirim"], jawaban: 1 },
        { soal: "Mengapa penting memperbarui (update) perangkat lunak secara berkala?", opsi: ["Agar tampilan lebih bagus saja", "Menutup celah keamanan yang bisa dieksploitasi", "Membuat perangkat lebih lambat", "Tidak ada manfaatnya"], jawaban: 1 }
    ];

    let quizIndex = 0;
    let quizBenar = 0;
    let quizSalah = 0;

    function mulaiQuiz() {
        quizIndex = 0;
        quizBenar = 0;
        quizSalah = 0;
        renderSoalQuiz();
    }

    function renderSoalQuiz() {
        const soal = soalQuiz[quizIndex];
        const progress = ((quizIndex) / soalQuiz.length) * 100;

        gameContent.innerHTML = `
            <div class="quiz-box">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-primary">Soal ${quizIndex + 1} / ${soalQuiz.length}</span>
                    <span class="badge bg-light text-dark">Skor: ${quizBenar * 10}</span>
                </div>
                <div class="progress quiz-progress mb-4">
                    <div class="progress-bar bg-primary" style="width:${progress}%"></div>
                </div>
                <h5 class="fw-bold mb-4">${soal.soal}</h5>
                <div id="opsiContainer">
                    ${soal.opsi.map((opsi, i) => `
                        <button class="quiz-option" data-index="${i}">${opsi}</button>
                    `).join("")}
                </div>
            </div>
        `;

        document.querySelectorAll(".quiz-option").forEach(btn => {
            btn.addEventListener("click", function () {
                jawabQuiz(parseInt(this.dataset.index));
            });
        });
    }

    function jawabQuiz(pilihan) {
        const soal = soalQuiz[quizIndex];
        const opsiButtons = document.querySelectorAll(".quiz-option");

        opsiButtons.forEach(btn => btn.style.pointerEvents = "none");

        if (pilihan === soal.jawaban) {
            quizBenar++;
            opsiButtons[pilihan].classList.add("correct");
        } else {
            quizSalah++;
            opsiButtons[pilihan].classList.add("wrong");
            opsiButtons[soal.jawaban].classList.add("correct");
        }

        setTimeout(() => {
            quizIndex++;
            if (quizIndex < soalQuiz.length) {
                renderSoalQuiz();
            } else {
                tampilkanHasil("Quiz Battle Informatika", quizBenar, quizSalah, soalQuiz.length);
            }
        }, 900);
    }

    // ============================================================
    // GAME 2: DRAG & DROP KLASIFIKASI PERANGKAT KOMPUTER
    // ============================================================
    const itemPerangkat = [
        { nama: "Keyboard", kategori: "Input" },
        { nama: "Mouse", kategori: "Input" },
        { nama: "Scanner", kategori: "Input" },
        { nama: "Monitor", kategori: "Output" },
        { nama: "Printer", kategori: "Output" },
        { nama: "Speaker", kategori: "Output" },
        { nama: "Processor (CPU)", kategori: "Proses" },
        { nama: "Harddisk", kategori: "Storage" }
    ];
    const kategoriList = ["Input", "Output", "Proses", "Storage"];
    let dndJawaban = {}; // { namaItem: kategoriYangDipilih }

    function mulaiDragDrop() {
        dndJawaban = {};

        const itemsHtml = itemPerangkat
            .map(it => `<div class="dnd-item" draggable="true" data-nama="${it.nama}" data-kategori="${it.kategori}">${it.nama}</div>`)
            .join("");

        const kategoriHtml = kategoriList.map(kat => `
            <div class="col-md-6 mb-3">
                <div class="dnd-category" data-kategori="${kat}">
                    <h6><i class="fas fa-folder-open me-1"></i>${kat}</h6>
                </div>
            </div>
        `).join("");

        gameContent.innerHTML = `
            <h5 class="fw-bold mb-2"><i class="fas fa-arrows-up-down-left-right me-2 text-info"></i>Klasifikasi Perangkat Komputer</h5>
            <p class="text-muted small mb-4">Seret (drag) setiap perangkat ke kategori yang tepat, lalu klik "Periksa Jawaban".</p>

            <div class="dnd-pool mb-4" id="dndPool">${itemsHtml}</div>

            <div class="row" id="dndCategories">${kategoriHtml}</div>

            <div class="text-center mt-3">
                <button class="btn btn-info text-white fw-bold rounded-pill px-4" id="btnPeriksaDnd">
                    <i class="fas fa-check me-2"></i>Periksa Jawaban
                </button>
            </div>
        `;

        setupDragDropEvents();
    }

    function setupDragDropEvents() {
        let draggedEl = null;

        document.querySelectorAll(".dnd-item").forEach(item => {
            item.addEventListener("dragstart", function () {
                draggedEl = this;
                this.classList.add("dragging");
            });
            item.addEventListener("dragend", function () {
                this.classList.remove("dragging");
            });
        });

        const dropZones = [
            document.getElementById("dndPool"),
            ...document.querySelectorAll(".dnd-category")
        ];

        dropZones.forEach(zone => {
            zone.addEventListener("dragover", function (e) {
                e.preventDefault();
                if (zone.classList.contains("dnd-category")) zone.classList.add("dragover");
            });
            zone.addEventListener("dragleave", function () {
                zone.classList.remove("dragover");
            });
            zone.addEventListener("drop", function (e) {
                e.preventDefault();
                zone.classList.remove("dragover");
                if (draggedEl) zone.appendChild(draggedEl);
            });
        });
    }

    document.addEventListener("click", function (e) {
        if (e.target && e.target.id === "btnPeriksaDnd") {
            periksaJawabanDnd();
        }
    });

    function periksaJawabanDnd() {
        let benar = 0;
        let salah = 0;

        document.querySelectorAll(".dnd-category").forEach(zone => {
            const kategoriZone = zone.dataset.kategori;
            zone.querySelectorAll(".dnd-item").forEach(item => {
                const kategoriAsli = item.dataset.kategori;
                if (kategoriAsli === kategoriZone) {
                    item.style.background = "linear-gradient(135deg,#1cc88a 0%,#36b9cc 100%)";
                    benar++;
                } else {
                    item.style.background = "linear-gradient(135deg,#e74a3b 0%,#f6c23e 100%)";
                    salah++;
                }
            });
        });

        // Item yang masih di pool (belum dipindah) dihitung salah
        const sisaDiPool = document.querySelectorAll("#dndPool .dnd-item").length;
        salah += sisaDiPool;

        setTimeout(() => {
            tampilkanHasil("Klasifikasi Perangkat Komputer", benar, salah, itemPerangkat.length);
        }, 1200);
    }

    // ============================================================
    // GAME 3: CYBER DEFENDER - DETEKSI PHISHING
    // ============================================================
    const kasusCyber = [
        { pesan: "Email: 'Selamat! Anda memenangkan iPhone 15. Klik link ini dalam 1 jam untuk klaim hadiah!'", jawaban: "phishing" },
        { pesan: "Notifikasi resmi dari sekolah lewat aplikasi e-learning tentang jadwal ujian minggu depan.", jawaban: "aman" },
        { pesan: "SMS: 'Rekening Anda akan diblokir. Masukkan PIN dan OTP Anda di link berikut untuk verifikasi.'", jawaban: "phishing" },
        { pesan: "Chat dari teman sekelas menanyakan tugas matematika hari ini di grup kelas.", jawaban: "aman" },
        { pesan: "Email dari 'admin-bank-resmi123@mail-gratis.com' meminta update data rekening segera.", jawaban: "phishing" },
        { pesan: "Pemberitahuan dari Google bahwa ada login baru ke akun Anda dari perangkat tidak dikenal.", jawaban: "aman" },
        { pesan: "Pesan WhatsApp dari nomor tak dikenal: 'Halo, ini Mama, HP Mama rusak, tolong transfer ke rekening ini ya.'", jawaban: "phishing" },
        { pesan: "Email konfirmasi pendaftaran webinar yang memang baru saja Anda daftar dari situs resminya.", jawaban: "aman" },
        { pesan: "Pop-up: 'Komputer Anda terinfeksi virus! Download aplikasi ini sekarang untuk membersihkannya.'", jawaban: "phishing" },
        { pesan: "Email guru melalui domain resmi sekolah berisi materi pelajaran tambahan.", jawaban: "aman" }
    ];

    let cyberIndex = 0;
    let cyberBenar = 0;
    let cyberSalah = 0;

    function mulaiCyber() {
        cyberIndex = 0;
        cyberBenar = 0;
        cyberSalah = 0;
        renderKasusCyber();
    }

    function renderKasusCyber() {
        const kasus = kasusCyber[cyberIndex];
        gameContent.innerHTML = `
            <div class="cyber-case">
                <div class="d-flex justify-content-between mb-3">
                    <span class="fw-bold text-danger">Kasus ${cyberIndex + 1} / ${kasusCyber.length}</span>
                    <span class="badge bg-light text-dark">Skor: ${cyberBenar * 10}</span>
                </div>
                <div class="cyber-message">
                    <i class="fas fa-envelope-open-text me-2 text-primary"></i>${kasus.pesan}
                </div>
                <p class="fw-semibold mb-3">Menurutmu, pesan ini termasuk?</p>
                <div class="d-flex gap-3" id="cyberOpsi">
                    <button class="btn btn-success flex-fill fw-bold rounded-pill" data-jawab="aman">
                        <i class="fas fa-shield-halved me-2"></i>Aman
                    </button>
                    <button class="btn btn-danger flex-fill fw-bold rounded-pill" data-jawab="phishing">
                        <i class="fas fa-triangle-exclamation me-2"></i>Phishing
                    </button>
                </div>
                <div id="cyberFeedback" class="mt-3 text-center fw-semibold"></div>
            </div>
        `;

        document.querySelectorAll("#cyberOpsi button").forEach(btn => {
            btn.addEventListener("click", function () {
                jawabCyber(this.dataset.jawab);
            });
        });
    }

    function jawabCyber(pilihan) {
        const kasus = kasusCyber[cyberIndex];
        const feedback = document.getElementById("cyberFeedback");
        document.querySelectorAll("#cyberOpsi button").forEach(b => b.disabled = true);

        if (pilihan === kasus.jawaban) {
            cyberBenar++;
            feedback.innerHTML = `<span class="text-success"><i class="fas fa-check-circle me-1"></i>Tepat! Jawaban benar.</span>`;
        } else {
            cyberSalah++;
            feedback.innerHTML = `<span class="text-danger"><i class="fas fa-times-circle me-1"></i>Kurang tepat. Jawaban yang benar: ${kasus.jawaban === "aman" ? "Aman" : "Phishing"}.</span>`;
        }

        setTimeout(() => {
            cyberIndex++;
            if (cyberIndex < kasusCyber.length) {
                renderKasusCyber();
            } else {
                tampilkanHasil("Cyber Defender: Deteksi Phishing", cyberBenar, cyberSalah, kasusCyber.length);
            }
        }, 1100);
    }

});
