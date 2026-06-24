/* ============================================ */
/* GOOGLE-SHEET.JS                              */
/* Fungsi untuk mengirim hasil game ke Google    */
/* Sheets melalui Google Apps Script Web App     */
/* ============================================ */

// GANTI URL DI BAWAH INI dengan URL Web App hasil deploy Apps Script Anda
// Contoh: "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec"
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxJ1ed8oVOBJgi9yCxxfOvBkq5sQ7EwKSwlOC1BnoRzlJMSk2DCZC9lUJVj2KaClR4EPA/exec";

/**
 * Mengirim hasil permainan siswa ke Google Sheets.
 * @param {Object} data - { nama, kelas, game, skor, benar, salah }
 */
function kirimNilaiKeSheet(data) {
    // Validasi sederhana
    if (!data || !data.nama || !data.kelas || !data.game) {
        console.error("Data tidak lengkap, pengiriman dibatalkan.", data);
        return;
    }

    const payload = {
        nama: data.nama,
        kelas: data.kelas,
        game: data.game,
        skor: data.skor,
        benar: data.benar,
        salah: data.salah
    };

    tampilkanStatusKirim("loading");

    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        // Gunakan text/plain agar tidak memicu preflight CORS pada Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(result => {
            if (result && result.status === "success") {
                tampilkanStatusKirim("success");
            } else {
                tampilkanStatusKirim("error");
            }
        })
        .catch(error => {
            console.error("Gagal mengirim nilai ke Google Sheets:", error);
            tampilkanStatusKirim("error");
        });
}

/**
 * Menampilkan notifikasi toast status pengiriman nilai.
 * @param {"loading"|"success"|"error"} status
 */
function tampilkanStatusKirim(status) {
    const existing = document.getElementById("sheetToast");
    if (existing) existing.remove();

    let icon = "fa-spinner fa-spin";
    let bg = "bg-secondary";
    let text = "Menyimpan nilai...";

    if (status === "success") {
        icon = "fa-check-circle";
        bg = "bg-success";
        text = "Nilai berhasil disimpan ke Google Sheets!";
    } else if (status === "error") {
        icon = "fa-exclamation-circle";
        bg = "bg-danger";
        text = "Gagal menyimpan nilai. Periksa koneksi internet.";
    }

    const toast = document.createElement("div");
    toast.id = "sheetToast";
    toast.className = "position-fixed top-0 start-50 translate-middle-x p-3";
    toast.style.zIndex = "9999";
    toast.style.marginTop = "90px";
    toast.innerHTML = `
        <div class="toast show align-items-center text-white ${bg} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${icon} me-2"></i>${text}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('#sheetToast').remove()"></button>
            </div>
        </div>
    `;
    document.body.appendChild(toast);

    if (status !== "loading") {
        setTimeout(() => toast.remove(), 3500);
    }
}
