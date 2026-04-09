import Common "common";

module {
  public type EntriLeaderboard = {
    userId : Common.UserId;
    namaPemain : Text;
    totalPoin : Nat;
    jumlahPermainan : Nat;
  };

  public type RiwayatSesi = {
    sessionId : Common.SessionId;
    tanggal : Common.Timestamp;
    mode : Text; // "solo" or "tim"
    poin : Nat;
    akurasi : Nat; // percentage 0-100
  };

  // Result types for submit answer
  public type HasilJawaban = {
    benar : Bool;
    poinDiperoleh : Nat;
    penjelasan : Text;
    semuaSudahJawab : Bool; // for team mode: all members answered
    poinTim : ?Nat; // team bonus score if evaluated
  };
};
