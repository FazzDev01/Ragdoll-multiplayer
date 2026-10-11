RAGDOLL MULTIPLAYER - STARTER

Isi project:
- index.html: game asal + percobaan sinkronisasi pemain remote dan tembakan.
- server.js: server WebSocket auto-matchmaking sederhana (semua pemain yang terhubung masuk arena bersama).
- package.json: dependensi server.

PENTING:
1. Multiplayer online BELUM langsung aktif hanya dengan membuka index.html. Server harus di-deploy ke hosting yang mendukung WebSocket.
2. Setelah deploy, ubah konstanta WS_URL di bagian atas script multiplayer dalam index.html menjadi URL WebSocket server, misalnya wss://domain-server-anda.
3. Upload ulang index.html bersama folder Image/ dan Sound/ seperti struktur asal.
4. Untuk menjalankan server lokal saat pengembangan: install Node.js, jalankan `npm install`, lalu `npm start`. Untuk akses online, deploy ke hosting Node.js yang mendukung WebSocket dan HTTPS/WSS.
5. Project asal ini adalah demo ragdoll/AK47. Source yang dikirim belum memiliki sistem musuh, wave, HP, atau boss co-op. Paket ini hanya menyiapkan fondasi sinkronisasi pemain/tembakan; sistem musuh dan damage bersama perlu dibuat sebagai tahap berikutnya.
6. Ini starter/prototipe, bukan server produksi: belum ada akun, room privat, validasi anti-cheat penuh, atau persistence.

Catatan kompatibilitas:
- Browser/WebView harus mengizinkan koneksi WebSocket ke URL server.
- Jangan gunakan ws:// dari halaman HTTPS; gunakan wss:// untuk hosting online.
