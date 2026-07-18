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

    // 2.5 Kunci Batas Minimum Tanggal Input (Hanya menerima Hari Ini & Masa Depan)
    const dateInput = document.getElementById("f-date");
    if (dateInput) {
        // Mengambil data tanggal hari ini berdasarkan jam lokal komputer klien
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Ditambah 1 karena bulan di JS dimulai dari 0
        const dd = String(today.getDate()).padStart(2, '0');
        
        // Format hasil akhirnya wajib YYYY-MM-DD (Misal: 2026-06-07)
        const formattedToday = `${yyyy}-${mm}-${dd}`;
        
        // Suntikkan atribut min="YYYY-MM-DD" langsung ke dalam elemen input HTML
        dateInput.min = formattedToday;
    }

    // 3. Logika Form Ganda: Kirim Data Senyap ke Email & Buka Teks Terstruktur di WhatsApp
    const bookingForm = document.getElementById("hybrid-booking-form");
    
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Menghentikan redirect bawaan browser

            // 1. AMBIL NILAI INPUT TERLEBIH DAHULU (Dipindahkan ke atas agar tidak ReferenceError)
            const clientName = document.getElementById("f-name").value.trim();
            const clientWA = document.getElementById("f-whatsapp").value.trim();
            const eventType = document.getElementById("f-type").value;
            const eventDate = document.getElementById("f-date").value;
            const langPref = document.getElementById("f-lang").value;
            const location = document.getElementById("f-loc").value.trim();
            const message = document.getElementById("f-msg").value.trim();

            // 2. VALIDASI TANGGAL MASA LALU (Sekarang aman karena eventDate sudah terdefinisi)
            const selectedDate = new Date(eventDate);
            const todayCheck = new Date();
            
            selectedDate.setHours(0,0,0,0);
            todayCheck.setHours(0,0,0,0);

            if (selectedDate < todayCheck) {
                alert("Maaf, tidak bisa memilih tanggal di masa lalu. Silakan pilih tanggal hari ini atau masa depan.");
                document.getElementById("f-date").focus();
                return false; 
            }

            // 3. KUNCI UTAMA & TEMPLATE WHATSAPP
            const targetWANumber = "6285110810257"; 
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

            const encodedText = encodeURIComponent(whatsappText);
            const whatsappURL = `https://wa.me/${targetWANumber}?text=${encodedText}`;

            // 4. EKSEKUSI TAHAP 1: Kirim data ke Web3Forms
            const formData = new FormData(bookingForm);

            fetch(bookingForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                // EKSEKUSI TAHAP 2: Buka WhatsApp & Reset Form
                window.open(whatsappURL, "_blank");
                bookingForm.reset(); 
            })
            .catch(error => {
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