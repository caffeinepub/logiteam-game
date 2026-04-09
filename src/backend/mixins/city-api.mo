import CityTypes "../types/city";
import CityLib "../lib/city";
import List "mo:core/List";

mixin (cityStore : List.List<CityTypes.CityQuestion>) {
  /// Return a single city question by ID. Returns null if not found.
  public query func getCityQuestion(id : Nat) : async ?CityTypes.CityQuestion {
    CityLib.getCityQuestion(cityStore, id);
  };

  /// Return all 10 city questions.
  public query func semuaCityQuestions() : async [CityTypes.CityQuestion] {
    CityLib.getAllCityQuestions(cityStore);
  };
};
