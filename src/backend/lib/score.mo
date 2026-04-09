import Common "../types/common";
import SessionTypes "../types/session";
import ScoreTypes "../types/score";
import PuzzleTypes "../types/puzzle";
import PuzzleLib "../lib/puzzle";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  public func submitJawaban(
    sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>,
    puzzles : List.List<PuzzleTypes.Puzzle>,
    sessionId : Common.SessionId,
    puzzleId : Common.PuzzleId,
    userId : Common.UserId,
    pilihanJawaban : Nat,
    now : Common.Timestamp,
  ) : ScoreTypes.HasilJawaban {
    let sesi = switch (sessions.get(sessionId)) {
      case null { return { benar = false; poinDiperoleh = 0; penjelasan = "Sesi tidak ditemukan"; semuaSudahJawab = false; poinTim = null } };
      case (?s) { s };
    };

    let puzzle = switch (PuzzleLib.getPuzzle(puzzles, puzzleId)) {
      case null { return { benar = false; poinDiperoleh = 0; penjelasan = "Puzzle tidak ditemukan"; semuaSudahJawab = false; poinTim = null } };
      case (?p) { p };
    };

    // Find the JawabanPuzzleInternal for this puzzle
    let jpIdx = sesi.jawabanPuzzles.findIndex(func(jp : SessionTypes.JawabanPuzzleInternal) : Bool { jp.puzzleId == puzzleId });

    let jpIndex = switch (jpIdx) {
      case null { return { benar = false; poinDiperoleh = 0; penjelasan = "Puzzle tidak ada dalam sesi"; semuaSudahJawab = false; poinTim = null } };
      case (?i) { i };
    };

    let jp = sesi.jawabanPuzzles[jpIndex];

    // Prevent duplicate answers from same user
    let alreadyAnswered = jp.jawabanAnggota.find(func(a : SessionTypes.JawabanAnggota) : Bool { Principal.equal(a.userId, userId) });
    switch (alreadyAnswered) {
      case (?_) {
        return { benar = false; poinDiperoleh = 0; penjelasan = "Anda sudah menjawab puzzle ini"; semuaSudahJawab = false; poinTim = null };
      };
      case null {};
    };

    let benar = pilihanJawaban == puzzle.jawabanBenar;
    let poin = PuzzleLib.hitungPoinDenganBonus(puzzle, benar, now, jp.waktuMulai);

    let jawaban : SessionTypes.JawabanAnggota = {
      userId = userId;
      pilihanJawaban;
      waktuSubmit = now;
      poinDiperoleh = poin;
      benar;
    };

    // Append the new answer
    jp.jawabanAnggota := jp.jawabanAnggota.concat([jawaban]);

    // Update session total for solo or update member's tally
    if (benar) {
      sesi.totalPoin := sesi.totalPoin + poin;
    };

    // Check if all members have answered this puzzle
    let jumlahAnggota = sesi.anggota.size();
    let jumlahJawaban = jp.jawabanAnggota.size();
    let semuaSudahJawab = jumlahJawaban >= jumlahAnggota;

    var poinTim : ?Nat = null;

    if (semuaSudahJawab and not jp.sudahDievaluasi) {
      jp.sudahDievaluasi := true;
      switch (sesi.mode) {
        case (#tim) {
          // Check if majority (>50%) answered correctly
          let benarCount = jp.jawabanAnggota.foldLeft(
            0,
            func(acc : Nat, a : SessionTypes.JawabanAnggota) : Nat { if (a.benar) { acc + 1 } else { acc } },
          );
          if (benarCount * 2 > jumlahAnggota) {
            // Apply 1.25x team bonus to the base poinDasar * benarCount
            let baseTeamPoin = puzzle.poinDasar * benarCount;
            let bonusPoin = baseTeamPoin + baseTeamPoin / 4; // 1.25x
            jp.poinTim := bonusPoin;
            poinTim := ?bonusPoin;
            // Add bonus to session total
            sesi.totalPoin := sesi.totalPoin + bonusPoin / benarCount; // add bonus delta per correct
          };
        };
        case (#solo) {};
      };
      // Advance to next puzzle index
      if (sesi.indeksPuzzleAktif + 1 < sesi.puzzles.size()) {
        sesi.indeksPuzzleAktif := sesi.indeksPuzzleAktif + 1;
      } else {
        sesi.status := #selesai;
        sesi.waktuSelesai := ?now;
      };
    };

    {
      benar;
      poinDiperoleh = poin;
      penjelasan = puzzle.penjelasan;
      semuaSudahJawab;
      poinTim;
    };
  };

  public func getPoinSesi(sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>, sessionId : Common.SessionId, userId : Common.UserId) : Nat {
    switch (sessions.get(sessionId)) {
      case null { 0 };
      case (?sesi) {
        switch (sesi.mode) {
          case (#solo) { sesi.totalPoin };
          case (#tim) {
            // Return the total of this user's individual points in the session
            sesi.jawabanPuzzles.foldLeft<SessionTypes.JawabanPuzzleInternal, Nat>(
              0,
              func(acc, jp) {
                let myJawaban = jp.jawabanAnggota.find(func(a : SessionTypes.JawabanAnggota) : Bool { Principal.equal(a.userId, userId) });
                switch (myJawaban) {
                  case null { acc };
                  case (?a) { acc + a.poinDiperoleh };
                };
              },
            );
          };
        };
      };
    };
  };

  public func getPoinKumulatif(riwayat : Map.Map<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>, userId : Common.UserId) : Nat {
    switch (riwayat.get(userId)) {
      case null { 0 };
      case (?list) {
        list.foldLeft<Nat, ScoreTypes.RiwayatSesi>(0, func(acc, r) { acc + r.poin });
      };
    };
  };

  public func simpanRiwayatSesi(
    riwayat : Map.Map<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>,
    userId : Common.UserId,
    entry : ScoreTypes.RiwayatSesi,
  ) {
    switch (riwayat.get(userId)) {
      case null {
        let list = List.singleton<ScoreTypes.RiwayatSesi>(entry);
        riwayat.add(userId, list);
      };
      case (?list) {
        list.add(entry);
        // Keep max 5: rebuild from the newest 5 entries
        if (list.size() > 5) {
          let arr = list.toArray();
          let start : Nat = if (arr.size() > 5) { arr.size() - 5 } else { 0 };
          list.clear();
          for (i in Nat.range(start, arr.size())) {
            list.add(arr[i]);
          };
        };
      };
    };
  };

  public func getRiwayatSesi(riwayat : Map.Map<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>, userId : Common.UserId) : [ScoreTypes.RiwayatSesi] {
    switch (riwayat.get(userId)) {
      case null { [] };
      case (?list) { list.toArray() };
    };
  };

  public func updateLeaderboard(
    leaderboard : List.List<ScoreTypes.EntriLeaderboard>,
    userId : Common.UserId,
    namaPemain : Text,
    tambahPoin : Nat,
  ) {
    // Find existing entry
    let existingIdx = leaderboard.findIndex(func(e : ScoreTypes.EntriLeaderboard) : Bool { Principal.equal(e.userId, userId) });
    switch (existingIdx) {
      case (?i) {
        let existing = leaderboard.at(i);
        leaderboard.put(i, {
          userId = existing.userId;
          namaPemain;
          totalPoin = existing.totalPoin + tambahPoin;
          jumlahPermainan = existing.jumlahPermainan + 1;
        });
      };
      case null {
        leaderboard.add({
          userId;
          namaPemain;
          totalPoin = tambahPoin;
          jumlahPermainan = 1;
        });
      };
    };
    // Sort descending by totalPoin
    leaderboard.sortInPlace(func(a, b) {
      if (a.totalPoin > b.totalPoin) { #less }
      else if (a.totalPoin < b.totalPoin) { #greater }
      else { #equal };
    });
    // Keep top 10
    leaderboard.truncate(10);
  };

  public func getLeaderboard(leaderboard : List.List<ScoreTypes.EntriLeaderboard>) : [ScoreTypes.EntriLeaderboard] {
    leaderboard.toArray();
  };
};
