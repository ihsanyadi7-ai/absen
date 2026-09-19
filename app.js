// Seed data siswa dummy (hanya sekali)
if (!localStorage.getItem('siswaTIKOM')) {
  const dummy = [
    { id:'S001', nis:'001', nama:'Ahmad Fauzi', kelas:'X TIKOM',
      alamat:'Kalijaga', barcode:'TIKOM-001', wajah:'Terdaftar' },
    { id:'S002', nis:'002', nama:'Siti Aminah', kelas:'X TIKOM',
      alamat:'Kalijaga', barcode:'TIKOM-002', wajah:'Terdaftar' },
    { id:'S003', nis:'003', nama:'Muhammad Rizki', kelas:'XI TIKOM',
      alamat:'Kalijaga', barcode:'TIKOM-003', wajah:'Belum' }
  ];
  localStorage.setItem('siswaTIKOM', JSON.stringify(dummy));
}
if (!localStorage.getItem('absenTIKOM')) {
  localStorage.setItem('absenTIKOM', JSON.stringify([]));
}

// Helper
function getSiswa() { return JSON.parse(localStorage.getItem('siswaTIKOM') || '[]'); }
function getAbsen() { return JSON.parse(localStorage.getItem('absenTIKOM') || '[]'); }
function simpanAbsen(data) { localStorage.setItem('absenTIKOM', JSON.stringify(data)); }

function catatAbsen(siswa, metode) {
  const absen = getAbsen();
  const now = new Date();
  const tanggal = now.toISOString().slice(0, 10);
  const jam = now.toTimeString().slice(0, 5);

  // Cek absensi ganda
  const sudah = absen.find(a => a.nis === siswa.nis && a.tanggal === tanggal);
  if (sudah) {
    return { sukses:false, pesan:`${siswa.nama} sudah absen hari ini (${sudah.jam}).` };
  }

  // Tentukan status (terlambat jika lewat jam 07:30)
  const [h, m] = jam.split(':').map(Number);
  const status = (h > 7 || (h === 7 && m > 30)) ? 'Terlambat' : 'Hadir';

  absen.push({
    id: 'A' + Date.now(),
    nis: siswa.nis, nama: siswa.nama, kelas: siswa.kelas,
    metode, tanggal, jam, status
  });
  simpanAbsen(absen);
  return { sukses:true, data: absen[absen.length - 1] };
}