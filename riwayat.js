function renderRiwayat() {
  const q = (document.getElementById('rCari').value || '').toLowerCase();
  const tgl = document.getElementById('rTanggal').value;
  const st = document.getElementById('rStatus').value;

  const list = getAbsen()
    .filter(a => (!q || a.nama.toLowerCase().includes(q) || a.nis.includes(q)))
    .filter(a => (!tgl || a.tanggal === tgl))
    .filter(a => (!st || a.status === st))
    .reverse();

  const tb = document.getElementById('tbodyRiwayat');
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">Belum ada riwayat absensi</td></tr>`;
    return;
  }
  tb.innerHTML = list.map((a, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${a.tanggal}</td>
      <td>${a.nis}</td>
      <td>${a.nama}</td>
      <td>${a.kelas}</td>
      <td><span class="badge bg-secondary">${a.metode}</span></td>
      <td>${a.jam}</td>
      <td><span class="badge ${a.status === 'Hadir' ? 'bg-success' : 'bg-warning text-dark'}">${a.status}</span></td>
    </tr>`).join('');
}

function resetFilter() {
  document.getElementById('rCari').value = '';
  document.getElementById('rTanggal').value = '';
  document.getElementById('rStatus').value = '';
  renderRiwayat();
}

function exportRiwayat() {
  const data = getAbsen().map((a, i) => ({
    No: i+1, Tanggal: a.tanggal, NIS: a.nis, Nama: a.nama,
    Kelas: a.kelas, Metode: a.metode, Jam: a.jam, Status: a.status
  }));
  if (!data.length) return alert('Belum ada data.');
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Riwayat');
  XLSX.writeFile(wb, `Laporan_Absensi_TIKOM_${new Date().toISOString().slice(0,10)}.xlsx`);
}

document.addEventListener('DOMContentLoaded', renderRiwayat);