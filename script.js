const blokSelect = document.getElementById("blok");
for (let i = 13; i <= 45; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  blokSelect.appendChild(option);
}

let data = {};
let editIndex = null;
let editTanggal = null;

function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const blok = document.getElementById("blok").value;
  const restan = parseInt(document.getElementById("rak").value);

  if (!tanggal || !blok || isNaN(rak)) {
    alert("Mohon lengkapi semua kolom!");
    return;
  }

  const total = restan * 500;

  if (editIndex !== null && editTanggal !== null) {
    data[editTanggal][editIndex] = { blok, rak, total };
    editIndex = null;
    editTanggal = null;
  } else {
    if (!data[tanggal]) {
      data[tanggal] = [];
    }
    data[tanggal].push({ blok, rak, total });
  }

  tampilkanPreview();
  bersihkanForm();
}

function tampilkanPreview() {
  const container = document.getElementById("previewTable");
  container.innerHTML = "";

  for (let tanggal in data) {
    let tableHTML = `
      <h3>Tanggal: ${tanggal}</h3>
      <table>
        <thead>
          <tr>
            <th>Blok</th>
            <th>Rak</th>
            <th>Total</th>
            <th>Menu</th>
          </tr>
        </thead>
        <tbody>
    `;

    let jumlahTotal = 0;

    data[tanggal].forEach((row, index) => {
      jumlahTotal += row.total;
      const rowId = `row-${tanggal}-${index}`;
      tableHTML += `
        <tr id="${rowId}" onclick="tampilkanAksi('${tanggal}', ${index})">
          <td>${row.blok}</td>
          <td>${row.rak}</td>
          <td>${row.total.toLocaleString()}</td>
          <td>
            <button class="action-btn edit-btn" id="edit-${rowId}" onclick="event.stopPropagation(); editData('${tanggal}', ${index})">Edit</button>
            <button class="action-btn delete-btn" id="delete-${rowId}" onclick="event.stopPropagation(); hapusData('${tanggal}', ${index})">Hapus</button>
          </td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Jumlah</strong></td>
            <td><strong>${jumlahTotal.toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>
    `;

    container.innerHTML += tableHTML;
  }
}

function tampilkanAksi(tanggal, index) {
  const rowId = `row-${tanggal}-${index}`;
  document.querySelectorAll(".action-btn").forEach(btn => btn.style.display = "none");
  document.getElementById(`edit-${rowId}`).style.display = "inline-block";
  document.getElementById(`delete-${rowId}`).style.display = "inline-block";
}

function editData(tanggal, index) {
  const item = data[tanggal][index];
  document.getElementById("tanggal").value = tanggal;
  document.getElementById("blok").value = item.blok;
  document.getElementById("rak").value = item.rak;
  editIndex = index;
  editTanggal = tanggal;
}

function hapusData(tanggal, index) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    data[tanggal].splice(index, 1);
    if (data[tanggal].length === 0) {
      delete data[tanggal];
    }
    tampilkanPreview();
  }
}

function bersihkanForm() {
  document.getElementById("blok").value = "";
  document.getElementById("rak").value = "";
  editIndex = null;
  editTanggal = null;
}

async function cetakPDF() {
  const { jsPDF } = window.jspdf;
  const element = document.querySelector(".preview");
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save("data-preview.pdf");
}

async function cetakGambar() {
  const element = document.querySelector(".preview");
  const canvas = await html2canvas(element);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "data-preview.png";
  link.click();
}

