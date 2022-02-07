import { countryStaff, movieData } from ".";

function threeMovies() {
  let movieBtnTwo = document.getElementById("movieBtn2");
  let resultMinutes = document.getElementById("resultMinutes");
  let resultPopulus = document.getElementById("resultPopulus");

  interface Duration {
    minutes: string;
  }

  interface Countries {
    country: string;
  }

  movieBtnTwo.addEventListener("click", function () {
    let inpOne = (<HTMLInputElement>document.getElementById("movie1")).value;
    let inpTwo = (<HTMLInputElement>document.getElementById("movie2")).value;
    let inpThree = (<HTMLInputElement>document.getElementById("movie3")).value;

    let inputSet = new Set([inpOne, inpTwo, inpThree]);

    let uniqueMovies = [...inputSet];
    let movieMinutes: number[] = [];
    let allCountryArr: string[] = [];
    let allCountryPopul: number[] = [];

    //there is needed for loop to access all three input fields

    for (let inp = 0; inp < uniqueMovies.length; inp++) {
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      let datasM: Promise<Duration> = movieData(uniqueMovies[inp]).then((allmData) => {
        return {
          minutes: allmData["Runtime"],
        };
      });
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      datasM.then((receivedMinutes) => {
        if (parseInt(receivedMinutes.minutes)) {
          movieMinutes.push(parseInt(receivedMinutes.minutes));
        }
        let totalMinutes = movieMinutes.reduce((accum, min) => {
          return accum + min;
        }, 0);

        resultMinutes.innerText = `All three movies total length is ${totalMinutes} minutes`;
      });

      //----------------------------------------------------------------------------------------

      let datasP: Promise<Countries> = movieData(uniqueMovies[inp]).then((allpData) => {
        return {
          country: allpData["Country"],
        };
      });

      datasP.then((c) => {
        if (c.country) {
          allCountryArr.push(...c.country.split(", "));
          [...new Set(allCountryArr)].forEach((country) => {
            countryStaff(country)
              .then((countryObj) => {
                allCountryPopul.push(parseInt(countryObj[0].population));
                let totalPopulus = [...new Set(allCountryPopul)].reduce((acc, curr) => {
                  return acc + curr;
                }, 0);

                resultPopulus.innerText = `All countries population where these movies were made is ${totalPopulus}`;
              })
              .catch(() => {
                resultPopulus.innerText = "Could not find country where movie was made";
              });
          });
        }
      });
    }
  });
}

export { threeMovies };
