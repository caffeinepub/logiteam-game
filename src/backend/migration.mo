import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import ScoreTypes "./types/score";
import SessionTypes "./types/session";
import Common "./types/common";

module {
  // ── Old types (copied from .old/src/backend) ──────────────────────────────

  type OldEntriLeaderboard = {
    userId : Common.UserId;
    namaPemain : Text;
    totalPoin : Nat;
    jumlahPermainan : Nat;
  };

  type OldJawabanAnggota = {
    userId : Common.UserId;
    pilihanJawaban : Nat;
    waktuSubmit : Common.Timestamp;
    poinDiperoleh : Nat;
    benar : Bool;
  };

  type OldJawabanPuzzleInternal = {
    puzzleId : Common.PuzzleId;
    var jawabanAnggota : [OldJawabanAnggota];
    var sudahDievaluasi : Bool;
    var poinTim : Nat;
    waktuMulai : Common.Timestamp;
  };

  type OldSesiInternal = {
    id : Common.SessionId;
    mode : SessionTypes.ModeSesi;
    var anggota : [Common.UserId];
    kodeJoin : ?Text;
    var puzzles : [Common.PuzzleId];
    var jawabanPuzzles : [OldJawabanPuzzleInternal];
    var totalPoin : Nat;
    var status : SessionTypes.StatusSesi;
    waktuMulai : Common.Timestamp;
    var waktuSelesai : ?Common.Timestamp;
    var indeksPuzzleAktif : Nat;
  };

  // ── Actor-level state types ────────────────────────────────────────────────

  type OldActor = {
    leaderboard : List.List<OldEntriLeaderboard>;
    sessions : Map.Map<Common.SessionId, OldSesiInternal>;
    riwayat : Map.Map<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>;
    codeIndex : Map.Map<Common.TeamCode, Common.SessionId>;
  };

  type NewActor = {
    leaderboard : List.List<ScoreTypes.EntriLeaderboard>;
    sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>;
    riwayat : Map.Map<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>;
    codeIndex : Map.Map<Common.TeamCode, Common.SessionId>;
  };

  // ── Migration function ─────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate leaderboard: add namaTim = null to each entry
    let leaderboard = old.leaderboard.map<OldEntriLeaderboard, ScoreTypes.EntriLeaderboard>(
      func(e) { { e with namaTim = null } }
    );

    // Migrate sessions: add var namaTim = null to each session
    let sessions = old.sessions.map<Common.SessionId, OldSesiInternal, SessionTypes.SesiInternal>(
      func(_id, s) {
        {
          id = s.id;
          mode = s.mode;
          var anggota = s.anggota;
          kodeJoin = s.kodeJoin;
          var puzzles = s.puzzles;
          var jawabanPuzzles = s.jawabanPuzzles;
          var totalPoin = s.totalPoin;
          var status = s.status;
          waktuMulai = s.waktuMulai;
          var waktuSelesai = s.waktuSelesai;
          var indeksPuzzleAktif = s.indeksPuzzleAktif;
          var namaTim = null;
        }
      }
    );

    {
      leaderboard;
      sessions;
      riwayat = old.riwayat;
      codeIndex = old.codeIndex;
    };
  };
};
