import Common "../types/common";
import SessionTypes "../types/session";
import ScoreTypes "../types/score";
import PuzzleTypes "../types/puzzle";
import ScoreLib "../lib/score";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

mixin (
  sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>,
  puzzles : List.List<PuzzleTypes.Puzzle>,
  riwayat : Map.Map<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>,
  leaderboard : List.List<ScoreTypes.EntriLeaderboard>,
  namaPemainStore : Map.Map<Common.UserId, Text>,
) {

  // Submit answer for a puzzle in a session
  public shared ({ caller }) func submitJawaban(
    sessionId : Common.SessionId,
    puzzleId : Common.PuzzleId,
    pilihanJawaban : Nat,
  ) : async ScoreTypes.HasilJawaban {
    let hasil = ScoreLib.submitJawaban(sessions, puzzles, sessionId, puzzleId, caller, pilihanJawaban, Time.now());
    // If session is now finished, save to history and auto-register on leaderboard
    switch (sessions.get(sessionId)) {
      case null {};
      case (?sesi) {
        if (sesi.status == #selesai) {
          // Calculate accuracy for this player
          var totalPuzzles = 0;
          var benarCount = 0;
          for (jp in sesi.jawabanPuzzles.vals()) {
            let myAns = jp.jawabanAnggota.find(func(a : SessionTypes.JawabanAnggota) : Bool { Principal.equal(a.userId, caller) });
            switch (myAns) {
              case null {};
              case (?a) {
                totalPuzzles += 1;
                if (a.benar) { benarCount += 1 };
              };
            };
          };
          let akurasi = if (totalPuzzles == 0) { 0 } else { benarCount * 100 / totalPuzzles };
          let modeText = switch (sesi.mode) { case (#solo) { "solo" }; case (#tim) { "tim" } };
          let playerPoin = ScoreLib.getPoinSesi(sessions, sessionId, caller);
          let entry : ScoreTypes.RiwayatSesi = {
            sessionId;
            tanggal = Time.now();
            mode = modeText;
            poin = playerPoin;
            akurasi;
          };
          ScoreLib.simpanRiwayatSesi(riwayat, caller, entry);
          // Auto-register on leaderboard
          let namaPemain = switch (namaPemainStore.get(caller)) {
            case (?nama) { nama };
            case null { caller.toText() };
          };
          let namaTim = sesi.namaTim;
          ScoreLib.updateLeaderboard(leaderboard, caller, namaPemain, namaTim, playerPoin);
        };
      };
    };
    hasil;
  };

  // Get score for current player in a session
  public query ({ caller }) func getPoinSesi(sessionId : Common.SessionId) : async Nat {
    ScoreLib.getPoinSesi(sessions, sessionId, caller);
  };

  // Get cumulative total score for the caller
  public query ({ caller }) func getPoinKumulatif() : async Nat {
    ScoreLib.getPoinKumulatif(riwayat, caller);
  };

  // Get session history for the caller (last 5)
  public query ({ caller }) func getRiwayatSesi() : async [ScoreTypes.RiwayatSesi] {
    ScoreLib.getRiwayatSesi(riwayat, caller);
  };

  // Get top 10 leaderboard
  public query func getLeaderboard() : async [ScoreTypes.EntriLeaderboard] {
    ScoreLib.getLeaderboard(leaderboard);
  };

  // Register/update player name on leaderboard after finishing a session
  // namaTim is optional — used for team sessions to display team name
  public shared ({ caller }) func daftarkanNama(namaPemain : Text, sessionId : Common.SessionId, namaTim : ?Text) : async () {
    // Store player display name for future auto-registrations
    namaPemainStore.add(caller, namaPemain);
    let poin = ScoreLib.getPoinSesi(sessions, sessionId, caller);
    // Resolve team name: prefer explicit namaTim arg, fall back to session's namaTim
    let resolvedNamaTim = switch (namaTim) {
      case (?t) { ?t };
      case null {
        switch (sessions.get(sessionId)) {
          case (?sesi) { sesi.namaTim };
          case null { null };
        };
      };
    };
    // Also persist namaTim on session if provided
    switch (namaTim) {
      case (?t) {
        switch (sessions.get(sessionId)) {
          case (?sesi) { sesi.namaTim := ?t };
          case null {};
        };
      };
      case null {};
    };
    ScoreLib.updateLeaderboard(leaderboard, caller, namaPemain, resolvedNamaTim, poin);
  };
};
