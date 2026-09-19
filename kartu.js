function isiPilihan() {
  const sel = document.getElementById('pilihSiswa');
  sel.innerHTML = '<option value="">-- Pilih Siswa --</option>' +
    getSiswa().map(s => `<option value="${s.id}">${s.nama} (${s.nis})</option>`).join('');
}

function buatKartuHTML(s) {
  return `
    <div class="kartu">
      <div class="kartu-header">
        <img src="assets/images/logo-sekolah.png" alt="Logo Sekolah">
        <h6>KARTU ABSENSI<br>KELAS INTENSIF TIKOM</h6>
      </div>
      <div class="kartu-body text-center">
        <img src="assets/images/default-user.png" class="foto" alt="Foto Siswa">
        <table class="table table-sm table-borderless mb-2">
          <tr><td class="text-start">Nama</td><td class="text-start"><b>${s.nama}</b></td></tr>
          <tr><td class="text-start">NIS</td><td class="text-start">${s.nis}</td></tr>
          <tr><td class="text-start">Kelas</td><td class="text-start">${s.kelas}</td></tr>
          <tr><td class="text-start">Sekolah</td><td class="text-start" style="font-size:11px">
            MAS Darussholihin NW Kalijaga</td></tr>
        </table>
      </div>
      <div class="kartu-footer">
        <svg class="barcode" data-kode="${s.barcode}"></svg>
        <div style="font-size:11px">${s.barcode}</div>
      </div>
    </div>`;
}

function generateBarcode(el) {
  JsBarcode(el, el.dataset.kode, { format:"CODE128", width:1.4, height:45, displayValue:false });
}

function renderKartu() {
  const id = document.getElementById('pilihSiswa').value;
  const area = document.getElementById('areaKartu');
  if (!id) { area.innerHTML = '<p class="text-muted">Pilih siswa untuk menampilkan kartu.</p>'; return; }
  const s = getSiswa().find(x => x.id === id);
  area.innerHTML = buatKartuHTML(s);
  generateBarcode(area.querySelector('.barcode'));
}

function cetakKartu() {
  const area = document.getElementById('areaKartu');
  if (!area.innerHTML.trim()) return alert('Pilih siswa terlebih dahulu.');
  cetak(area.innerHTML);
}

function cetakSemua() {
  const semua = getSiswa().map(s => buatKartuHTML(s)).join('');
  cetak(semua);
}

function cetak(html) {
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>Cetak Kartu</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
    </head><body class="p-4 d-flex flex-wrap gap-3">
      ${html}
      <script>
        document.querySelectorAll('.barcode').forEach(el =>
          JsBarcode(el, el.dataset.kode, {format:'CODE128',width:1.4,height:45,displayValue:false}));
        setTimeout(() => window.print(), 500);
      <\/script>
    </body></html>`);
  w.document.close();
}

document.addEventListener('DOMContentLoaded', isiPilihan);