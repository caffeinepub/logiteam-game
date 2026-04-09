import Common "../types/common";
import SessionTypes "../types/session";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  // Generate a deterministic 6-char code from a session id and timestamp
  func genCode(id : Nat, now : Int) : Text {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let charsLen = chars.size();
    var seed = id + (if (now > 0) { now.toNat() % 1_000_000 } else { 0 });
    var code = "";
    for (_ in Nat.range(0, 6)) {
      let idx = seed % charsLen;
      seed := seed / charsLen + seed * 7919 % 999983;
      let c = chars.toArray()[idx];
      code := code # Text.fromChar(c);
    };
    code;
  };

  func toPublicJawabanPuzzle(jp : SessionTypes.JawabanPuzzleInternal) : SessionTypes.JawabanPuzzle {
    {
      puzzleId = jp.puzzleId;
      jawabanAnggota = jp.jawabanAnggota;
      sudahDievaluasi = jp.sudahDievaluasi;
      poinTim = jp.poinTim;
      waktuMulai = jp.waktuMulai;
    };
  };

  public func toPublic(sesi : SessionTypes.SesiInternal) : SessionTypes.Sesi {
    {
      id = sesi.id;
      mode = sesi.mode;
      anggota = sesi.anggota;
      kodeJoin = sesi.kodeJoin;
      puzzles = sesi.puzzles;
      jawabanPuzzles = sesi.jawabanPuzzles.map<SessionTypes.JawabanPuzzleInternal, SessionTypes.JawabanPuzzle>(
        toPublicJawabanPuzzle,
      );
      totalPoin = sesi.totalPoin;
      status = sesi.status;
      waktuMulai = sesi.waktuMulai;
      waktuSelesai = sesi.waktuSelesai;
      indeksPuzzleAktif = sesi.indeksPuzzleAktif;
    };
  };

  // Build JawabanPuzzleInternal entries for all puzzle ids
  func initJawabanPuzzles(puzzleIds : [Common.PuzzleId], now : Common.Timestamp) : [SessionTypes.JawabanPuzzleInternal] {
    Array.tabulate<SessionTypes.JawabanPuzzleInternal>(
      puzzleIds.size(),
      func(i) {
        {
          puzzleId = puzzleIds[i];
          var jawabanAnggota = [];
          var sudahDievaluasi = false;
          var poinTim = 0;
          waktuMulai = now;
        };
      },
    );
  };

  public func buatSesiSolo(
    sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>,
    nextId : Nat,
    userId : Common.UserId,
    puzzleIds : [Common.PuzzleId],
    now : Common.Timestamp,
  ) : Common.SessionId {
    let sesi : SessionTypes.SesiInternal = {
      id = nextId;
      mode = #solo;
      var anggota = [userId];
      kodeJoin = null;
      var puzzles = puzzleIds;
      var jawabanPuzzles = initJawabanPuzzles(puzzleIds, now);
      var totalPoin = 0;
      var status = #aktif;
      waktuMulai = now;
      var waktuSelesai = null;
      var indeksPuzzleAktif = 0;
    };
    sessions.add(nextId, sesi);
    nextId;
  };

  public func buatSesiTim(
    sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>,
    codeIndex : Map.Map<Common.TeamCode, Common.SessionId>,
    nextId : Nat,
    userId : Common.UserId,
    puzzleIds : [Common.PuzzleId],
    now : Common.Timestamp,
  ) : (Common.SessionId, Common.TeamCode) {
    let kode = genCode(nextId, now);
    let sesi : SessionTypes.SesiInternal = {
      id = nextId;
      mode = #tim;
      var anggota = [userId];
      kodeJoin = ?kode;
      var puzzles = puzzleIds;
      var jawabanPuzzles = initJawabanPuzzles(puzzleIds, now);
      var totalPoin = 0;
      var status = #aktif;
      waktuMulai = now;
      var waktuSelesai = null;
      var indeksPuzzleAktif = 0;
    };
    sessions.add(nextId, sesi);
    codeIndex.add(kode, nextId);
    (nextId, kode);
  };

  public func bergabungSesiTim(
    sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>,
    codeIndex : Map.Map<Common.TeamCode, Common.SessionId>,
    userId : Common.UserId,
    kode : Common.TeamCode,
  ) : ?Common.SessionId {
    switch (codeIndex.get(kode)) {
      case null { null };
      case (?sessionId) {
        switch (sessions.get(sessionId)) {
          case null { null };
          case (?sesi) {
            // Add user if not already member
            let alreadyMember = sesi.anggota.find(func(u : Common.UserId) : Bool { Principal.equal(u, userId) });
            switch (alreadyMember) {
              case (?_) {};
              case null {
                sesi.anggota := sesi.anggota.concat([userId]);
              };
            };
            ?sessionId;
          };
        };
      };
    };
  };

  public func getSesi(sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>, id : Common.SessionId) : ?SessionTypes.Sesi {
    switch (sessions.get(id)) {
      case null { null };
      case (?sesi) { ?toPublic(sesi) };
    };
  };
};
