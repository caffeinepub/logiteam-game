import Common "types/common";
import SessionTypes "types/session";
import ScoreTypes "types/score";
import PuzzleTypes "types/puzzle";
import CityTypes "types/city";
import PuzzleLib "lib/puzzle";
import CityLib "lib/city";
import PuzzleApi "mixins/puzzle-api";
import SessionApi "mixins/session-api";
import ScoreApi "mixins/score-api";
import CityApi "mixins/city-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  // Puzzle data store
  let puzzles = List.empty<PuzzleTypes.Puzzle>();

  // City-guessing question store
  let cityStore = List.empty<CityTypes.CityQuestion>();

  // Session state
  let sessions = Map.empty<Common.SessionId, SessionTypes.SesiInternal>();
  let codeIndex = Map.empty<Common.TeamCode, Common.SessionId>();

  // Score and history state
  let riwayat = Map.empty<Common.UserId, List.List<ScoreTypes.RiwayatSesi>>();
  let leaderboard = List.empty<ScoreTypes.EntriLeaderboard>();

  // Seed puzzles on first initialization (idempotent — only seeds when empty)
  if (puzzles.size() == 0) {
    PuzzleLib.seedPuzzles(puzzles);
  };

  // Seed city questions on first initialization (idempotent — only seeds when empty)
  if (cityStore.size() == 0) {
    CityLib.seedCityQuestions(cityStore);
  };

  include PuzzleApi(puzzles);
  include SessionApi(sessions, codeIndex, puzzles);
  include ScoreApi(sessions, puzzles, riwayat, leaderboard);
  include CityApi(cityStore);
};
