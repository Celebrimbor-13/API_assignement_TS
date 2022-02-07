import "../css/index.css";
import { threeMovies } from "./threeInputs";

let monthArr: string[] = ["jen", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

let movieButton = document.getElementById("movieBtn");
let resultDiv = document.getElementById("resultOne");
let yearsAge = resultDiv.appendChild(document.createElement("p"));
let actorNames = resultDiv.appendChild(document.createElement("p"));
let currencyNflag = resultDiv.appendChild(document.createElement("div"));

//++++++++++++++++++++++
interface MovieData {
  countries: string;
  actorNames: string;
  released: string;
  minutes: string;
}

interface CountryData {
  currencies: string;
  flags: { png: string };
  population: string;
}
//+++++++++++++++++++++++

threeMovies();

// fetch movies
function movieData(search: string): Promise<MovieData> {
  const FETCH_MOVIE = `http://www.omdbapi.com/?t=${search}&apikey=84ebe415`;

  return fetch(FETCH_MOVIE).then((search) => {
    return search.json().then((allmData) => {
      return {
        countries: allmData["Country"],
        actorNames: allmData["Actors"],
        released: allmData["Released"],
        minutes: allmData["Runtime"],
      };
    });
  });
}

// fetch data for country flags and currencies and population
function countryStaff(country: string): Promise<CountryData> {
  const FETCH_COUNTRY = `https://restcountries.com/v3.1/name/${country}?fullText=true`;

  return fetch(FETCH_COUNTRY).then((country) => {
    return country.json().then((allcData) => {
      return {
        currencies: allcData[0].currencies,
        flags: allcData[0].flags,
        population: allcData[0].population,
      };
    });
  });
}

movieButton.addEventListener("click", function () {
  // to clear from old map and currency elements
  if (currencyNflag.children.length) {
    while (currencyNflag.firstChild) {
      currencyNflag.removeChild(currencyNflag.firstChild);
    }
  }

  let receivedMovie = (<HTMLInputElement>document.getElementById("movieName")).value;

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  let ourMovie = movieData(receivedMovie);
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // this part of code is responsible for retrieveing release year of movie and actor names
  ourMovie
    .then((movie) => {
      let currentYear: number = new Date().getFullYear();
      let currentMonth: number = new Date().getMonth();
      let released = movie.released.split(" ");
      let actors = movie.actorNames.split(",");
      let country = movie.countries.split(", ");
      let actorsAsStr = "";

      actors.forEach((actor) => {
        let readyActors = actor.trim().split(" ")[0] + ", ";
        actorsAsStr += readyActors;
      });

      yearsAge.innerText =
        currentYear - parseInt(released[2]) > 0
          ? `${receivedMovie} was relesed ${currentYear - parseInt(released[2])} year(s) ago`
          : `${receivedMovie} was released ${currentMonth - monthArr.indexOf(released[1])} month(s) ago`;

      actorNames.innerText = `Actors who played main roles: ${actorsAsStr.slice(0, -2)}`;
      //
      return country;
    })

    // ---------------------------------------------------------------------
    // this part of code is responsible fro flags and currencies
    .then((country) => {
      for (let c = 0; c < country.length; c++) {
        let currencyP = currencyNflag.appendChild(document.createElement("p"));
        let flagImg = currencyNflag.appendChild(document.createElement("img"));

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        let ourCountry = countryStaff(country[c].trim());
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        ourCountry
          .then((readyCdata) => {
            currencyP.innerText = ` Currency  for ${country[c].trim()} is ${Object.keys(readyCdata.currencies)}. `;
            flagImg.src = readyCdata.flags["png"];
          })
          // does not recognize old movies, for example soviet movies
          .catch(() => {
            currencyP.innerText = "Could not find country";
          });
      }
    })
    // alert if no movie found in database
    .catch(() => {
      yearsAge.innerText = "Please enter valid data!";
    });
});

export { movieData, countryStaff };
