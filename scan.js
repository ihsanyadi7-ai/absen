let html5Qr = null;
let streamWajah = null;

/* ============ SCAN BARCODE ============ */
function startScan() {
  if (html5Qr) return;
  document.getElementById('reader').innerHTML = '<div id="qrArea"></div>';
  html5Qr = new Html5Qrcode("qrArea");
  html5Qr.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 180 } },
    (text) => { prosesBarcode(text); stopScan(); },
    () => {}
  ).catch(err => alert('Gagal akses kamera: ' + err));
}

function stopScan() {
  if (html5Qr) { html5Qr.stop().then(() => { html5Qr.clear(); html5Qr = null; });
    document.getElementById('reader').innerHTML =
      '<div class="text-white text-center"><i class="bi bi-camera-video fs-1"></i><p class="mt-2">Kamera belum aktif</p></div>';
  }
}

function prosesBarcode(kode) {
  const siswa = getSiswa().find(s => s.barcode === kode || s.nis === kode);
  const box = document.getElementById('hasilScan');
  if (!siswa) {
    box.innerHTML = `<div class="alert alert-danger">Data barcode <b>${kode}</b> tidak terdaftar.</div>`;
    return;
  }
  const hasil = catatAbsen(siswa, 'Barcode');
  if (!hasil.sukses) {
    box.innerHTML = `<div class="alert alert-warning">${hasil.pesan}</div>`;
    return;
  }
  box.innerHTML = `
    <div class="alert alert-success">
      <h6 class="fw-bold mb-2"><i class="bi bi-check-circle-fill"></i> Absensi Berhasil!</h6>
      <img src="assets/images/default-user.png" class="rounded-circle mb-2" width="70">
      <div><b>${siswa.nama}</b></div>
      <div class="small">NIS: ${siswa.nis} | ${siswa.kelas}</div>
      <div class="small">Metode: ${hasil.data.metode}</div>
      <div class="small">${hasil.data.tanggal} • ${hasil.data.jam}</div>
      <span class="badge bg-success mt-2">${hasil.data.status}</span>
    </div>`;
}

/* ============ SCAN WAJAH (Simulasi terstruktur) ============ */
async function startWajah() {
  const box = document.getElementById('videoWajah');
  try {
    streamWajah = await navigator.mediaDevices.getUserMedia({ video: true });
    box.innerHTML = `<video autoplay playsinline></video><div class="scan-frame"></div>`;
    box.querySelector('video').srcObject = streamWajah;

    document.getElementById('hasilWajah').innerHTML =
      `<div class="text-primary">Mendeteksi wajah...</div>`;

    // Simulasi: setelah 3 detik, cocokkan dengan siswa pertama
    setTimeout(() => cocokkanWajah(), 3000);
  } catch (e) {
    alert('Kamera tidak dapat diakses: ' + e.message);
  }
}

function stopWajah() {
  if (streamWajah) { streamWajah.getTracks().forEach(t => t.stop()); streamWajah = null; }
  document.getElementById('videoWajah').innerHTML =
    '<div class="text-white text-center"><i class="bi bi-person-bounding-box fs-1"></i><p class="mt-2">Kamera wajah belum aktif</p></div>';
}

function cocokkanWajah() {
  // ⚠️ Untuk produksi, gunakan face-api.js dengan model descriptor.
  // Di sini contoh: cocokkan ke siswa pertama sebagai demo.
  const siswa = getSiswa()[0];
  const hasil = catatAbsen(siswa, 'Wajah');
  const box = document.getElementById('hasilWajah');
  if (!hasil.sukses) { box.innerHTML = `<div class="alert alert-warning">${hasil.pesan}</div>`; return; }
  box.innerHTML = `
    <div class="alert alert-success">
      <h6 class="fw-bold"><i class="bi bi-emoji-smile-fill"></i> Wajah Dikenali!</h6>
      <div><b>${siswa.nama}</b></div>
      <div class="small">NIS: ${siswa.nis} | ${siswa.kelas}</div>
      <div class="small">${hasil.data.tanggal} • ${hasil.data.jam}</div>
      <span class="badge bg-success">${hasil.data.status}</span>
    </div>`;
  stopWajah();
}