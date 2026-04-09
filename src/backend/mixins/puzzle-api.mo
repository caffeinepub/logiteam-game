import Common "../types/common";
import PuzzleTypes "../types/puzzle";
import PuzzleLib "../lib/puzzle";
import List "mo:core/List";

mixin (puzzles : List.List<PuzzleTypes.Puzzle>) {

  public query func getPuzzle(id : Common.PuzzleId) : async ?PuzzleTypes.Puzzle {
    PuzzleLib.getPuzzle(puzzles, id);
  };

  public query func semuaPuzzle() : async [PuzzleTypes.Puzzle] {
    PuzzleLib.getAllPuzzles(puzzles);
  };

  public query func puzzleByKesulitan(kesulitan : PuzzleTypes.Difficulty) : async [PuzzleTypes.Puzzle] {
    PuzzleLib.getPuzzlesByDifficulty(puzzles, kesulitan);
  };
};
