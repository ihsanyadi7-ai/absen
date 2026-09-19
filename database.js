function renderTabel() {
  const q = (document.getElementById('cari')?.value || '').toLowerCase();
  const list = getSiswa().filter(s =>
    s.nama.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q));
  const tb = document.getElementById('tbodySiswa');
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">Belum ada data siswa</td></tr>`;
    return;
  }
  tb.innerHTML = list.map((s, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${s.nis}</td>
      <td>${s.nama}</td>
      <td>${s.kelas}</td>
      <td>${s.alamat}</td>
      <td><span class="badge bg-success">${s.barcode}</span></td>
      <td><span class="badge ${s.wajah === 'Terdaftar' ? 'bg-primary' : 'bg-secondary'}">${s.wajah}</span></td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editSiswa('${s.id}')">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="hapusSiswa('${s.id}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`).join('');
}

function resetForm() {
  ['f_id','f_nis','f_nama','f_kelas','f_alamat','f_barcode'].forEach(id =>
    document.getElementById(id).value = '');
  document.getElementById('f_wajah').value = 'Belum';
}

function simpanSiswa() {
  const data = {
    id: document.getElementById('f_id').value || 'S' + Date.now(),
    nis: document.getElementById('f_nis').value.trim(),
    nama: document.getElementById('f_nama').value.trim(),
    kelas: document.getElementById('f_kelas').value.trim(),
    alamat: document.getElementById('f_alamat').value.trim(),
    barcode: document.getElementById('f_barcode').value.trim(),
    wajah: document.getElementById('f_wajah').value
  };
  if (!data.nis || !data.nama || !data.kelas)
    return alert('NIS, Nama, dan Kelas wajib diisi!');
  if (!data.barcode) data.barcode = 'TIKOM-' + data.nis;

  const list = getSiswa();
  const idx = list.findIndex(s => s.id === data.id);
  if (idx >= 0) list[idx] = data; else list.push(data);
  localStorage.setItem('siswaTIKOM', JSON.stringify(list));
  bootstrap.Modal.getInstance(document.getElementById('modalSiswa')).hide();
  renderTabel();
}

function editSiswa(id) {
  const s = getSiswa().find(x => x.id === id);
  if (!s) return;
  document.getElementById('f_id').value = s.id;
  document.getElementById('f_nis').value = s.nis;
  document.getElementById('f_nama').value = s.nama;
  document.getElementById('f_kelas').value = s.kelas;
  document.getElementById('f_alamat').value = s.alamat;
  document.getElementById('f_barcode').value = s.barcode;
  document.getElementById('f_wajah').value = s.wajah;
  new bootstrap.Modal(document.getElementById('modalSiswa')).show();
}

function hapusSiswa(id) {
  if (!confirm('Yakin ingin menghapus siswa ini?')) return;
  const list = getSiswa().filter(s => s.id !== id);
  localStorage.setItem('siswaTIKOM', JSON.stringify(list));
  renderTabel();
}

document.addEventListener('DOMContentLoaded', renderTabel);