module {
  public type CityQuestion = {
    id : Nat;
    gambar1 : Text; // Descriptive text/emoji for landmark 1 (rendered as illustrated card on frontend)
    gambar2 : Text; // Descriptive text/emoji for landmark 2 (rendered as illustrated card on frontend)
    namaKota : Text; // Correct city name
    pilihan : [Text]; // 4 city name options including the correct one
    poinDasar : Nat;
    batasWaktu : Nat; // in seconds
    penjelasan : Text; // Fun fact about the city
  };
};
