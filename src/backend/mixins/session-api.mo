import Common "../types/common";
import SessionTypes "../types/session";
import PuzzleTypes "../types/puzzle";
import SessionLib "../lib/session";
import PuzzleLib "../lib/puzzle";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  sessions : Map.Map<Common.SessionId, SessionTypes.SesiInternal>,
  codeIndex : Map.Map<Common.TeamCode, Common.SessionId>,
  puzzles : List.List<PuzzleTypes.Puzzle>,
) {

  var nextSessionId : Nat = 1;

  // Create a solo session; returns new session id
  public shared ({ caller }) func buatSesiSolo() : async Common.SessionId {
    let puzzleIds = PuzzleLib.pilihPuzzleUntukSesi(puzzles, 10);
    let id = SessionLib.buatSesiSolo(sessions, nextSessionId, caller, puzzleIds, Time.now());
    nextSessionId += 1;
    id;
  };

  // Create a team session; returns (sessionId, joinCode)
  public shared ({ caller }) func buatSesiTim() : async (Common.SessionId, Common.TeamCode) {
    let puzzleIds = PuzzleLib.pilihPuzzleUntukSesi(puzzles, 10);
    let result = SessionLib.buatSesiTim(sessions, codeIndex, nextSessionId, caller, puzzleIds, Time.now());
    nextSessionId += 1;
    result;
  };

  // Join a team session by 6-char code; returns sessionId or null if not found
  public shared ({ caller }) func bergabungSesiTim(kode : Common.TeamCode) : async ?Common.SessionId {
    SessionLib.bergabungSesiTim(sessions, codeIndex, caller, kode);
  };

  public query func getSesi(sessionId : Common.SessionId) : async ?SessionTypes.Sesi {
    SessionLib.getSesi(sessions, sessionId);
  };

  // Set team name on a session (caller must be a member)
  public shared ({ caller }) func setNamaTim(sessionId : Common.SessionId, namaTim : Text) : async Bool {
    SessionLib.setNamaTim(sessions, sessionId, caller, namaTim);
  };
};
