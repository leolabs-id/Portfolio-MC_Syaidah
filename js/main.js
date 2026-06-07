document.addEventListener("DOMContentLoaded", function () {
    // 1. Inisialisasi Icon Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Logika Penanganan Tombol Floating WhatsApp (Tampil setelah scroll melewati Hero)
    const waFloatingBtn = document.getElementById("whatsapp-floating");
    const heroSection = document.getElementById("home");

    window.addEventListener("scroll", function () {
        if (heroSection && waFloatingBtn) {
            const heroHeight = heroSection.offsetHeight;
            if (window.scrollY > (heroHeight - 100)) {
                waFloatingBtn.classList.add("visible");
            } else {
                waFloatingBtn.classList.remove("visible");
            }
        }
    });

    // 3. Logika Form Ganda: Kirim Data Senyap ke Email & Buka Teks Terstruktur di WhatsApp
    const bookingForm = document.getElementById("hybrid-booking-form");
    
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Menghentikan redirect bawaan browser agar skrip sinkron berjalan

            // Mengambil seluruh nilai input form
            const clientName = document.getElementById("f-name").value.trim();
            const clientWA = document.getElementById("f-whatsapp").value.trim();
            const eventType = document.getElementById("f-type").value;
            const eventDate = document.getElementById("f-date").value;
            const langPref = document.getElementById("f-lang").value;
            const location = document.getElementById("f-loc").value.trim();
            const message = document.getElementById("f-msg").value.trim();

            // Kunci Utama: Nomor WhatsApp Resmi MC Syaidah (Format International Tanpa + atau Spasi)
            const targetWANumber = "6285110810257"; 

            // Membangun template struktur teks untuk dikirim ke WhatsApp Syaidah
            const whatsappText = `Halo MC Syaidah, saya tertarik untuk melakukan booking jadwal. Berikut detail acaranya:\n\n` +
                                 `*Formulir Kontak Website:*\n` +
                                 `-------------------------------------\n` +
                                 `• *Nama Lengkap :* ${clientName}\n` +
                                 `• *No. WhatsApp :* ${clientWA}\n` +
                                 `• *Jenis Acara     :* ${eventType}\n` +
                                 `• *Tanggal Acara  :* ${eventDate}\n` +
                                 `• *Bahasa Acara  :* ${langPref}\n` +
                                 `• *Lokasi Acara    :* ${location}\n` +
                                 `-------------------------------------\n\n` +
                                 `*Pesan Tambahan:*\n` +
                                 `"${message}"\n\n` +
                                 `Apakah pada tanggal tersebut jadwal Kak Syaidah masih tersedia?`;

            // Enkripsi teks agar aman dibaca oleh URL Browser menuju API WhatsApp
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappURL = `https://wa.me/${targetWANumber}?text=${encodedText}`;

            // Eksekusi Tahap 1: Kirim data secara senyap ke Email (Web3Forms) di latar belakang
            const formData = new FormData(bookingForm);

            fetch(bookingForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                // Eksekusi Tahap 2: Buka WhatsApp di tab baru setelah form sukses terekam di email
                window.open(whatsappURL, "_blank");
                bookingForm.reset(); // Mengosongkan isian form kembali
            })
            .catch(error => {
                // Penanganan darurat: Jika sinyal drop atau API email macet, redirect WA tetap dipaksa jalan agar konversi tidak hilang
                console.error("Email submission failed, redirecting to WA...", error);
                window.open(whatsappURL, "_blank");
            });
        });
    }
});

// 4. Fungsi Pengganti Bahasa Global (Bilingual Toggle System)
function toggleLanguage(lang) {
    if (!document.getElementById(`btn-${lang}`)) return;
    
    // Memperbarui status aktif elemen tombol toggle
    document.getElementById("btn-id").classList.remove("active");
    document.getElementById("btn-en").classList.remove("active");
    document.getElementById(`btn-${lang}`).classList.add("active");

    // Mengganti teks elemen berdasarkan objek Dictionary terpusat
    const elementsToTranslate = document.querySelectorAll(".lang-el");
    
    elementsToTranslate.forEach(el => {
        const idKey = el.id;
        if (typeof dictionary !== 'undefined' && dictionary[lang] && dictionary[lang][idKey]) {
            el.innerHTML = dictionary[lang][idKey];
        }
    });
}