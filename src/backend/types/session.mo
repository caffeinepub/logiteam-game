import Common "common";

module {
  public type ModeSesi = { #solo; #tim };

  public type StatusSesi = { #aktif; #selesai };

  public type JawabanAnggota = {
    userId : Common.UserId;
    pilihanJawaban : Nat; // index of chosen option
    waktuSubmit : Common.Timestamp;
    poinDiperoleh : Nat;
    benar : Bool;
  };

  // Internal — mutable fields
  public type JawabanPuzzleInternal = {
    puzzleId : Common.PuzzleId;
    var jawabanAnggota : [JawabanAnggota]; // all member answers
    var sudahDievaluasi : Bool;
    var poinTim : Nat; // after team bonus
    waktuMulai : Common.Timestamp;
  };

  // Public API type — no var fields
  public type JawabanPuzzle = {
    puzzleId : Common.PuzzleId;
    jawabanAnggota : [JawabanAnggota];
    sudahDievaluasi : Bool;
    poinTim : Nat;
    waktuMulai : Common.Timestamp;
  };

  // Internal session — mutable fields
  public type SesiInternal = {
    id : Common.SessionId;
    mode : ModeSesi;
    var anggota : [Common.UserId];
    kodeJoin : ?Text; // team code (6 chars), null for solo
    var puzzles : [Common.PuzzleId];
    var jawabanPuzzles : [JawabanPuzzleInternal];
    var totalPoin : Nat;
    var status : StatusSesi;
    waktuMulai : Common.Timestamp;
    var waktuSelesai : ?Common.Timestamp;
    var indeksPuzzleAktif : Nat;
  };

  // Public session for API boundary
  public type Sesi = {
    id : Common.SessionId;
    mode : ModeSesi;
    anggota : [Common.UserId];
    kodeJoin : ?Text;
    puzzles : [Common.PuzzleId];
    jawabanPuzzles : [JawabanPuzzle];
    totalPoin : Nat;
    status : StatusSesi;
    waktuMulai : Common.Timestamp;
    waktuSelesai : ?Common.Timestamp;
    indeksPuzzleAktif : Nat;
  };
};
