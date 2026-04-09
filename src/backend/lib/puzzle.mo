import Types "../types/puzzle";
import Common "../types/common";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";

module {
  // Seed 15 Indonesian-language puzzles about teamwork and group cohesion
  public func seedPuzzles(puzzles : List.List<Types.Puzzle>) {
    let data : [Types.Puzzle] = [
      {
        id = 1;
        pertanyaan = "Dalam sebuah tim yang solid, ketika seorang anggota menghadapi masalah pribadi yang mempengaruhi pekerjaannya, apa yang sebaiknya dilakukan oleh anggota tim lainnya?";
        pilihan = [
          "Mengabaikan masalah tersebut dan fokus pada pekerjaan masing-masing",
          "Menawarkan bantuan dengan empati dan redistribusi tugas sementara",
          "Langsung melaporkan kepada pemimpin tanpa bicara dengan yang bersangkutan",
          "Menyelesaikan semua pekerjaan mereka tanpa memberitahu siapapun",
        ];
        jawabanBenar = 1;
        kesulitan = #mudah;
        penjelasan = "Kekompakan tim dibangun melalui empati dan saling mendukung. Menawarkan bantuan dengan bijak dan meredistribusi tugas sementara menunjukkan kepedulian tanpa mengabaikan tujuan tim.";
        poinDasar = 100;
        batasWaktu = 30;
      },
      {
        id = 2;
        pertanyaan = "Tim Anda harus mengambil keputusan penting dalam waktu singkat, namun terdapat perbedaan pendapat yang tajam. Strategi terbaik untuk mencapai keputusan bersama adalah...";
        pilihan = [
          "Pemimpin tim langsung memutuskan tanpa mendengar semua pendapat",
          "Voting mayoritas tanpa diskusi lebih lanjut",
          "Setiap orang mempresentasikan pendapat beserta alasannya, lalu dicari solusi yang mengakomodasi kepentingan terbaik tim",
          "Menunda keputusan sampai semua setuju",
        ];
        jawabanBenar = 2;
        kesulitan = #sedang;
        penjelasan = "Pengambilan keputusan kolaboratif yang efektif melibatkan mendengarkan semua perspektif dan mencari solusi terbaik bagi tim, bukan sekadar mayoritas atau otoritas sepihak.";
        poinDasar = 150;
        batasWaktu = 45;
      },
      {
        id = 3;
        pertanyaan = "Apa yang dimaksud dengan 'kepercayaan psikologis' (psychological safety) dalam konteks tim?";
        pilihan = [
          "Keyakinan bahwa tidak ada bahaya fisik di tempat kerja",
          "Rasa aman untuk berbicara, bertanya, atau membuat kesalahan tanpa takut dihukum",
          "Jaminan bahwa semua keputusan tim selalu benar",
          "Kepercayaan bahwa semua anggota tim adalah ahli di bidangnya",
        ];
        jawabanBenar = 1;
        kesulitan = #mudah;
        penjelasan = "Psychological safety adalah fondasi tim yang efektif — ketika anggota merasa aman untuk berbagi ide, mengakui kesalahan, dan bereksperimen, inovasi dan kolaborasi berkembang pesat.";
        poinDasar = 100;
        batasWaktu = 30;
      },
      {
        id = 4;
        pertanyaan = "Dalam konteks BLC PPPK, apa prinsip utama yang mendorong kekompakan antar peserta?";
        pilihan = [
          "Kompetisi ketat untuk meraih nilai tertinggi",
          "Kolaborasi, saling berbagi ilmu, dan saling mendukung dalam proses belajar bersama",
          "Mengikuti instruktur tanpa perlu berinteraksi dengan sesama peserta",
          "Menyelesaikan tugas secara individual untuk efisiensi waktu",
        ];
        jawabanBenar = 1;
        kesulitan = #mudah;
        penjelasan = "BLC PPPK dirancang untuk membangun komunitas belajar yang saling mendukung. Kekompakan kelompok dibangun melalui kolaborasi aktif dan berbagi pengetahuan antar peserta.";
        poinDasar = 100;
        batasWaktu = 30;
      },
      {
        id = 5;
        pertanyaan = "Seorang anggota tim selalu mendominasi diskusi dan tidak memberi ruang kepada anggota lain. Sebagai anggota tim, apa respons yang paling tepat?";
        pilihan = [
          "Membiarkan saja karena dia memang paling berpengalaman",
          "Memotong pembicaraannya secara agresif",
          "Secara sopan mengundang anggota lain untuk berbagi: 'Bagaimana pendapat yang lain?'",
          "Melaporkan perilakunya kepada atasan",
        ];
        jawabanBenar = 2;
        kesulitan = #sedang;
        penjelasan = "Fasilitasi inklusif adalah keterampilan tim yang penting. Mengundang partisipasi semua anggota secara sopan memastikan semua suara didengar dan meningkatkan kualitas keputusan.";
        poinDasar = 150;
        batasWaktu = 40;
      },
      {
        id = 6;
        pertanyaan = "Model 'Tuckman' menggambarkan tahapan perkembangan tim. Urutan tahapan yang benar adalah...";
        pilihan = [
          "Forming → Norming → Storming → Performing → Adjourning",
          "Forming → Storming → Norming → Performing → Adjourning",
          "Storming → Forming → Performing → Norming → Adjourning",
          "Norming → Forming → Storming → Adjourning → Performing",
        ];
        jawabanBenar = 1;
        kesulitan = #sedang;
        penjelasan = "Model Tuckman: Forming (pembentukan), Storming (konflik), Norming (penyesuaian), Performing (kinerja optimal), Adjourning (penutupan). Konflik adalah tahap normal yang harus dilalui untuk mencapai kinerja tinggi.";
        poinDasar = 150;
        batasWaktu = 45;
      },
      {
        id = 7;
        pertanyaan = "Tim Anda sedang mengerjakan proyek besar dan seorang anggota konsisten tidak memenuhi target. Setelah diskusi personal ternyata ia tidak memahami tugasnya. Langkah terbaik selanjutnya?";
        pilihan = [
          "Keluarkan dari tim karena merugikan kelompok",
          "Ambil alih semua tugasnya tanpa memberi tahu",
          "Pasangkan dia dengan anggota berpengalaman sebagai mentor dan buat rencana pengembangan bersama",
          "Laporkan langsung ke manajemen atas",
        ];
        jawabanBenar = 2;
        kesulitan = #sedang;
        penjelasan = "Pendekatan mentoring menunjukkan investasi dalam pengembangan anggota tim. Ini memperkuat ikatan tim, meningkatkan kompetensi, dan lebih produktif dibandingkan hukuman atau pengabaian.";
        poinDasar = 150;
        batasWaktu = 45;
      },
      {
        id = 8;
        pertanyaan = "Apa yang dimaksud dengan 'groupthink' dan mengapa berbahaya bagi tim?";
        pilihan = [
          "Berpikir bersama-sama — ini selalu menghasilkan keputusan terbaik",
          "Fenomena di mana keinginan untuk harmoni mengalahkan pemikiran kritis, sehingga tim mengambil keputusan buruk tanpa mempertimbangkan alternatif",
          "Metode brainstorming kelompok yang efektif",
          "Proses sinkronisasi pemikiran yang mempercepat pekerjaan tim",
        ];
        jawabanBenar = 1;
        kesulitan = #sulit;
        penjelasan = "Groupthink berbahaya karena menekan perbedaan pendapat demi harmoni semu. Tim yang efektif justru mendorong 'devil's advocate' dan pemikiran kritis untuk menghasilkan keputusan berkualitas.";
        poinDasar = 200;
        batasWaktu = 60;
      },
      {
        id = 9;
        pertanyaan = "Dalam resolusi konflik tim, pendekatan 'win-win' (menang-menang) diutamakan karena...";
        pilihan = [
          "Selalu menghasilkan keputusan yang paling cepat",
          "Menjamin bahwa semua pihak mendapatkan semua yang mereka inginkan",
          "Menjaga hubungan jangka panjang dan memastikan semua pihak merasa dihargai, sehingga komitmen terhadap solusi lebih kuat",
          "Menghindari diskusi yang panjang dan melelahkan",
        ];
        jawabanBenar = 2;
        kesulitan = #sedang;
        penjelasan = "Pendekatan win-win dalam resolusi konflik membangun kepercayaan dan komitmen bersama. Ketika semua pihak merasa dihargai, mereka lebih termotivasi untuk mengimplementasikan solusi dengan sepenuh hati.";
        poinDasar = 150;
        batasWaktu = 45;
      },
      {
        id = 10;
        pertanyaan = "Komunikasi yang efektif dalam tim mengutamakan...";
        pilihan = [
          "Penyampaian informasi sebanyak-banyaknya dalam waktu sesingkat mungkin",
          "Mendengarkan aktif, kejelasan pesan, dan umpan balik yang konstruktif",
          "Penggunaan jargon profesional untuk menunjukkan kompetensi",
          "Komunikasi satu arah dari pemimpin ke anggota",
        ];
        jawabanBenar = 1;
        kesulitan = #mudah;
        penjelasan = "Komunikasi efektif bukan hanya bicara, tetapi mendengarkan dengan sungguh-sungguh, menyampaikan pesan dengan jelas, dan memberikan umpan balik yang membangun. Ini adalah pilar kekompakan tim.";
        poinDasar = 100;
        batasWaktu = 30;
      },
      {
        id = 11;
        pertanyaan = "Seorang anggota tim memberikan kritik tajam terhadap ide Anda di depan semua orang. Respons yang paling konstruktif adalah...";
        pilihan = [
          "Langsung membalas dengan kritik terhadap idenya",
          "Diam dan menyimpan kekesalan",
          "Berterima kasih atas masukan, meminta klarifikasi, lalu merespons secara faktual tanpa emosi",
          "Mengabaikan komentarnya dan melanjutkan presentasi",
        ];
        jawabanBenar = 2;
        kesulitan = #sedang;
        penjelasan = "Merespons kritik dengan ketenangan dan rasa ingin tahu menunjukkan kematangan profesional. Meminta klarifikasi membantu memahami perspektif berbeda dan sering menghasilkan peningkatan ide yang signifikan.";
        poinDasar = 150;
        batasWaktu = 40;
      },
      {
        id = 12;
        pertanyaan = "Apa perbedaan utama antara kelompok kerja (work group) dan tim (team) yang efektif?";
        pilihan = [
          "Tim memiliki lebih banyak anggota dibandingkan kelompok kerja",
          "Kelompok kerja bekerja di satu tempat, tim bisa bekerja jarak jauh",
          "Tim memiliki tujuan bersama, saling ketergantungan, akuntabilitas kolektif, dan sinergi yang menghasilkan output melebihi kontribusi individual",
          "Tidak ada perbedaan, keduanya sama",
        ];
        jawabanBenar = 2;
        kesulitan = #sulit;
        penjelasan = "Tim sejati berbeda dari kumpulan individu: ada interdependensi, tujuan bersama, dan hasil kolektif yang melebihi jumlah kontribusi individual (sinergi 1+1>2). Inilah yang membuat tim lebih powerful.";
        poinDasar = 200;
        batasWaktu = 60;
      },
      {
        id = 13;
        pertanyaan = "Dalam proses orientasi anggota baru PPPK, apa yang paling penting untuk membangun rasa memiliki (sense of belonging)?";
        pilihan = [
          "Memberikan daftar aturan dan prosedur yang lengkap",
          "Memperkenalkan mereka kepada tim, jelaskan budaya organisasi, dan libatkan dalam proyek nyata dari awal",
          "Membiarkan mereka belajar sendiri agar cepat mandiri",
          "Menugaskan pekerjaan administratif terlebih dahulu",
        ];
        jawabanBenar = 1;
        kesulitan = #mudah;
        penjelasan = "Sense of belonging dibangun melalui koneksi sosial dan keterlibatan bermakna. Memperkenalkan budaya dan melibatkan dalam pekerjaan nyata sejak awal mempercepat integrasi dan meningkatkan retensi.";
        poinDasar = 100;
        batasWaktu = 35;
      },
      {
        id = 14;
        pertanyaan = "Konsep 'interdependensi positif' dalam pembelajaran kooperatif berarti...";
        pilihan = [
          "Anggota tim saling bergantung sehingga keberhasilan satu orang berarti keberhasilan semua",
          "Setiap anggota harus bergantung pada pemimpin untuk semua keputusan",
          "Tim bergantung pada sumber daya eksternal untuk keberhasilan",
          "Anggota belajar dari kegagalan satu sama lain",
        ];
        jawabanBenar = 0;
        kesulitan = #sedang;
        penjelasan = "Interdependensi positif adalah inti kerja tim: ketika satu anggota sukses, semua merasakan manfaatnya, dan ketika satu gagal, tim menanggung bersama. Ini menciptakan motivasi intrinsik untuk saling mendukung.";
        poinDasar = 150;
        batasWaktu = 45;
      },
      {
        id = 15;
        pertanyaan = "Sebuah tim yang baru dibentuk mengalami konflik karena perbedaan gaya kerja. Pemimpin tim yang efektif akan...";
        pilihan = [
          "Memerintahkan semua anggota untuk beradaptasi dengan gaya kerja pemimpin",
          "Memfasilitasi diskusi tentang perbedaan gaya kerja, menciptakan norma tim yang disepakati bersama, dan memanfaatkan keberagaman sebagai kekuatan",
          "Memisahkan anggota yang berkonflik ke tim yang berbeda",
          "Mengabaikan konflik dan berharap akan selesai sendiri",
        ];
        jawabanBenar = 1;
        kesulitan = #sulit;
        penjelasan = "Pemimpin yang efektif mengubah perbedaan menjadi aset. Dengan memfasilitasi dialog terbuka dan menciptakan norma bersama, tim yang beragam justru lebih kreatif dan tangguh dalam menghadapi tantangan.";
        poinDasar = 200;
        batasWaktu = 60;
      },
    ];
    for (puzzle in data.vals()) {
      puzzles.add(puzzle);
    };
  };

  public func getPuzzle(puzzles : List.List<Types.Puzzle>, id : Common.PuzzleId) : ?Types.Puzzle {
    puzzles.find(func(p) { p.id == id });
  };

  public func getAllPuzzles(puzzles : List.List<Types.Puzzle>) : [Types.Puzzle] {
    puzzles.toArray();
  };

  public func getPuzzlesByDifficulty(puzzles : List.List<Types.Puzzle>, kesulitan : Types.Difficulty) : [Types.Puzzle] {
    puzzles.filter(func(p) { p.kesulitan == kesulitan }).toArray();
  };

  // Returns all puzzle IDs (seeded order acts as shuffled enough for gameplay)
  public func pilihPuzzleUntukSesi(puzzles : List.List<Types.Puzzle>, jumlah : Nat) : [Common.PuzzleId] {
    let all = puzzles.toArray();
    let count = if (jumlah > all.size()) { all.size() } else { jumlah };
    Array.tabulate<Common.PuzzleId>(count, func(i) { all[i].id });
  };

  // Time bonus: full bonus if answered within 50% of allotted time
  public func hitungPoinDenganBonus(puzzle : Types.Puzzle, benar : Bool, waktuJawab : Int, waktuMulai : Common.Timestamp) : Nat {
    if (not benar) { return 0 };
    let elapsedNs : Int = waktuJawab - waktuMulai;
    let batasNs : Int = puzzle.batasWaktu.toInt() * 1_000_000_000;
    let halfBatasNs : Int = batasNs / 2;
    if (elapsedNs <= halfBatasNs) {
      // Time bonus: 50% extra points
      puzzle.poinDasar + puzzle.poinDasar / 2;
    } else {
      puzzle.poinDasar;
    };
  };
};
