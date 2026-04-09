import Common "common";

module {
  public type Difficulty = { #mudah; #sedang; #sulit };

  public type Puzzle = {
    id : Common.PuzzleId;
    pertanyaan : Text;
    pilihan : [Text]; // 4 options
    jawabanBenar : Nat; // index of correct option
    kesulitan : Difficulty;
    penjelasan : Text;
    poinDasar : Nat;
    batasWaktu : Nat; // seconds allowed
  };
};
