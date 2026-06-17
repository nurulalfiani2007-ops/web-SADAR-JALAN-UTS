// ============================================
// WEB SADAR JALAN - NAVIGATION SCRIPT
// Nurul Alfiani - 250212094
// ============================================

// Tunggu sampai halaman sepenuhnya dimuat
window.addEventListener('load', function() {
    
    console.log('Website Sadar Jalan siap digunakan!');
    
    // ===== FUNGSI NAVIGASI HALAMAN =====
    function showPage(pageId) {
        // Sembunyikan SEMUA halaman
        const allPages = document.querySelectorAll('.page-section');
        allPages.forEach(function(page) {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Tampilkan halaman yang dipilih
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            console.log('Halaman dibuka: ' + pageId);
        } else {
            console.error('Halaman tidak ditemukan: page-' + pageId);
        }
        
        // Update menu aktif
        const allLinks = document.querySelectorAll('.nav-link[data-page]');
        allLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector('.nav-link[data-page="' + pageId + '"]');
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // ===== PASANG EVENT LISTENER KE SEMUA MENU =====
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah link berpindah halaman
            
            const pageId = this.getAttribute('data-page');
            console.log('Menu diklik: ' + pageId);
            
            showPage(pageId);
            
            // Tutup menu mobile jika terbuka
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // ===== TAMPILKAN HALAMAN BERANDA SAAT PERTAMA KALI =====
    showPage('beranda');
    
    // ===== FUNGSI TOMBOL-TOMBOL LAINNYA =====
    
    // Tombol Jadwal Mingguan
    const btnJadwal = document.getElementById('btn-jadwal-mingguan');
    if (btnJadwal) {
        btnJadwal.addEventListener('click', function() {
            alert('📅 Fitur Cek Jadwal Pusat sedang dimuat...');
        });
    }
    
    // Tombol Lapor Titik
    const btnLapor = document.getElementById('btn-lapor-titik');
    if (btnLapor) {
        btnLapor.addEventListener('click', function() {
            alert('📍 Membuka formulir pelaporan titik razia...');
        });
    }
    
    // Tombol Refresh Peta
    const btnRefresh = document.getElementById('btn-refresh-maps');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function() {
            const originalText = btnRefresh.innerHTML;
            btnRefresh.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Memuat...';
            btnRefresh.disabled = true;
            
            setTimeout(function() {
                btnRefresh.innerHTML = originalText;
                btnRefresh.disabled = false;
                alert('✅ Peta berhasil diperbarui!');
            }, 1500);
        });
    }
    
    // Tombol Pencarian
    const btnSearch = document.getElementById('btn-nav-search');
    if (btnSearch) {
        btnSearch.addEventListener('click', function() {
            const query = prompt(' Cari informasi:');
            if (query) {
                alert('Mencari: ' + query);
            }
        });
    }
    
    // Tombol Notifikasi
    const btnNotif = document.getElementById('btn-nav-notif');
    if (btnNotif) {
        btnNotif.addEventListener('click', function() {
            alert(' Anda memiliki 3 notifikasi baru.');
        });
    }
    
    // Tombol Filter Wilayah
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const wilayah = this.getAttribute('data-wilayah');
            alert('🗺️ Filter: ' + wilayah);
        });
    });
    
    // Tombol Cek SIM
    const btnCekSim = document.getElementById('btn-cek-sim');
    if (btnCekSim) {
        btnCekSim.addEventListener('click', function() {
            const inputSim = document.getElementById('input-nomor-sim');
            if (inputSim && inputSim.value.trim() === '') {
                alert('⚠️ Nomor SIM wajib diisi!');
                return;
            }
            
            const simResult = document.getElementById('sim-result');
            if (simResult) {
                simResult.style.display = 'block';
            }
        });
    }
  // ============================================
// FITUR LAPORAN RAZIA (Dengan LocalStorage)
// ============================================

// 1. Data Default (Akan muncul pertama kali jika belum ada data)
const defaultReports = [
    { id: 1, lokasi: 'Bundaran Simpang 5', jenis: 'Razia Helm', waktu: '10 menit lalu', validasi: 12 },
    { id: 2, lokasi: 'Jembatan Terminal', jenis: 'Razia SIM', waktu: '25 menit lalu', validasi: 8 },
    { id: 3, lokasi: 'Bundaran Kota', jenis: 'Razia Umum', waktu: '1 jam lalu', validasi: 23 }
];

// 2. Fungsi untuk mengambil data dari LocalStorage
function getReports() {
    const stored = localStorage.getItem('raziaReports');
    return stored ? JSON.parse(stored) : defaultReports;
}

// 3. Fungsi untuk menyimpan data ke LocalStorage
function saveReports(reports) {
    localStorage.setItem('raziaReports', JSON.stringify(reports));
}

// 4. Fungsi untuk menghapus laporan
window.deleteReport = function(id) {
    if (confirm('⚠️ Apakah Anda yakin ingin menghapus laporan ini?')) {
        let reports = getReports();
        const index = reports.findIndex(r => r.id === id);
        
        if (index !== -1) {
            const deletedReport = reports[index];
            reports.splice(index, 1); // Hapus dari array
            
            saveReports(reports); // Simpan perubahan
            renderReports();      // Tampilkan ulang
            
            alert('✅ Laporan "' + deletedReport.lokasi + '" berhasil dihapus.');
        }
    }
};

// 5. Fungsi untuk menampilkan (Render) Laporan ke HTML
function renderReports() {
    const reports = getReports();
    const reportList = document.querySelector('.report-list');
    
    // Kosongkan list terlebih dahulu, tapi sisakan judul
    reportList.innerHTML = '<h3 class="mb-3">Validasi Laporan Warga</h3>';
    
    reports.forEach(report => {
        const article = document.createElement('article');
        article.className = 'report-card';
        article.innerHTML = `
            <div class="report-header">
                <h5>${report.lokasi}</h5>
                <span class="report-time">${report.waktu}</span>
            </div>
            <p><i class="bi bi-exclamation-triangle-fill"></i> ${report.jenis} • <strong>${report.validasi} Validasi</strong></p>
            <div class="report-actions">
                <button class="btn btn-validate btn-true" onclick="validateReport(${report.id}, 'benar')">
                    <i class="bi bi-check-lg"></i> Benar
                </button>
                <button class="btn btn-validate btn-done" onclick="validateReport(${report.id}, 'selesai')">
                    <i class="bi bi-check-all"></i> Selesai
                </button>
                <button class="btn btn-validate btn-delete" onclick="deleteReport(${report.id})">
                    <i class="bi bi-trash-fill"></i> Hapus
                </button>
            </div>
        `;
        reportList.appendChild(article);
    });
}

// 6. Fungsi Global untuk Validasi (Dipanggil saat tombol diklik)
window.validateReport = function(id, type) {
    let reports = getReports();
    const index = reports.findIndex(r => r.id === id);
    
    if (index !== -1) {
        if (type === 'benar') {
            reports[index].validasi += 1; // Tambah angka validasi
            alert(`✅ Laporan "${reports[index].lokasi}" divalidasi BENAR.\nTotal validasi sekarang: ${reports[index].validasi}`);
        } else if (type === 'selesai') {
            alert(`✅ Razia di "${reports[index].lokasi}" ditandai SELESAI.`);
        }
        
        saveReports(reports); // Simpan perubahan
        renderReports();      // Tampilkan ulang agar angka berubah
    }
};

// 7. Event Listener untuk Tombol Kirim Laporan
const btnSubmitReport = document.querySelector('.btn-submit-report');
if (btnSubmitReport) {
    btnSubmitReport.addEventListener('click', function() {
        const lokasiInput = document.getElementById('input-lokasi');
        const jenisInput = document.querySelector('.report-form-card select');
        const keteranganInput = document.querySelector('.report-form-card textarea');
        
        const lokasi = lokasiInput ? lokasiInput.value.trim() : '';
        const jenis = jenisInput ? jenisInput.value : 'Razia Umum';
        
        // Validasi input tidak boleh kosong
        if (lokasi === '') {
            alert('⚠️ Lokasi wajib diisi!');
            return;
        }
        
        let reports = getReports();
        
        // Buat ID baru (ambil ID terbesar + 1)
        const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
        
        // Tambahkan data baru ke array (paling atas / unshift)
        reports.unshift({
            id: newId,
            lokasi: lokasi,
            jenis: jenis,
            waktu: 'Baru saja',
            validasi: 0
        });
        
        saveReports(reports); // Simpan ke LocalStorage
        renderReports();      // Refresh tampilan
        
        // Reset Form
        if (lokasiInput) lokasiInput.value = '';
        if (jenisInput) jenisInput.selectedIndex = 0;
        if (keteranganInput) keteranganInput.value = '';
        
        alert('✅ Laporan berhasil dikirim dan tersimpan!');
    });
}

// 8. Panggil fungsi render saat halaman pertama kali dimuat
renderReports(); 
    
    const btnValidateDone = document.querySelectorAll('.btn-done');
    btnValidateDone.forEach(function(btn) {
        btn.addEventListener('click', function() {
            alert('✅ Razia ditandai SELESAI.');
        });
    });
    
    // Tombol Logout
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                alert('👋 Anda telah logout.');
            }
        });
    }
    
    // Tombol Baca Selengkapnya
    const btnReadMore = document.querySelectorAll('.btn-read-more');
    btnReadMore.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const title = this.closest('.news-card').querySelector('h3').textContent;
            alert('📖 Membaca: ' + title);
        });
    });
    
});