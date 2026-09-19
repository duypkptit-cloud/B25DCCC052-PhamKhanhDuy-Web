const danhSachSP = [
  { ten: "Ao thun", gia: 100000 },
  { ten: "Quan jean", gia: 250000 },
  { ten: "Non luoi trai", gia: 80000 }
];

let gioHang = []; 

function dinhDangGia(gia, donVi = "VND") {
  return gia.toLocaleString() + " " + donVi;
}

function tinhTongTien(...danhSachGia) {
  let tong = 0;
  for (let i = 0; i < danhSachGia.length; i++) {
    tong = tong + danhSachGia[i];
  }
  return tong;
}

function hienThiSanPham() {
  const bang = document.getElementById("bangSanPham");

  bang.innerHTML = "<tr><th>Ten san pham</th><th>Gia</th><th></th></tr>";

  for (let i = 0; i < danhSachSP.length; i++) {
    const { ten, gia } = danhSachSP[i];

    const dongHtml = `
      <tr>
        <td>${ten}</td>
        <td>${dinhDangGia(gia)}</td>
        <td><button onclick="themVaoGio(${i})">Them vao gio</button></td>
      </tr>
    `;

    bang.innerHTML += dongHtml;
  }
}

const themVaoGio = (index) => {
  const sp = danhSachSP[index];

  const spTrongGio = { ten: sp.ten, gia: sp.gia };

  gioHang.push(spTrongGio);
  hienThiGioHang();
};

const xoaKhoiGio = (index) => {
  gioHang.splice(index, 1);
  hienThiGioHang();
};

function hienThiGioHang() {
  const bang = document.getElementById("bangGioHang");
  bang.innerHTML = "<tr><th>Ten san pham</th><th>Gia</th><th></th></tr>";

  for (let i = 0; i < gioHang.length; i++) {
    const { ten, gia } = gioHang[i]; 

    const dongHtml = `
      <tr>
        <td>${ten}</td>
        <td>${dinhDangGia(gia)}</td>
        <td><button onclick="xoaKhoiGio(${i})">Xoa</button></td>
      </tr>
    `;
    bang.innerHTML += dongHtml;
  }

  const mangGia = gioHang.map(sp => sp.gia);

  const tong = tinhTongTien(...mangGia);

  document.getElementById("tongTien").innerText = tong.toLocaleString();
}

function goiApiDatHang() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (gioHang.length === 0) {
        reject("Gio hang dang trong, khong the dat hang!");
      } else {
        resolve("Dat hang thanh cong!");
      }
    }, 1000);
  });
}

document.getElementById("btnDatHang").addEventListener("click", function () {
  document.getElementById("ketQua").innerText = "Dang xu ly...";

  goiApiDatHang()
    .then(function (thongBao) {
      document.getElementById("ketQua").innerText = thongBao;
      gioHang = []; 
      hienThiGioHang();
    })
    .catch(function (loi) {
      document.getElementById("ketQua").innerText = loi;
    });
});

hienThiSanPham();
hienThiGioHang();