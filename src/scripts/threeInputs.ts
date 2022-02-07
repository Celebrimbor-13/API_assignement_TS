import { countryStaff, movieData } from ".";

function threeMovies() {
  let movieBtnTwo = document.getElementById("movieBtn2");
  let resultMinutes = document.getElementById("resultMinutes");
  let resultPopulus = document.getElementById("resultPopulus");
  //______________________________________________________
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
      if (uniqueMovies[inp]) {
        let datasM = movieData(uniqueMovies[inp]);
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

        datasM
          .then((c) => {
            allCountryArr.push(...c.countries.split(", "));
            [...new Set(allCountryArr)].forEach((country) => {
              countryStaff(country)
                .then((countryObj) => {
                  allCountryPopul.push(parseInt(countryObj.population));
                  let totalPopulus = [...new Set(allCountryPopul)].reduce((acc, curr) => {
                    return acc + curr;
                  }, 0);

                  resultPopulus.innerText = `All countries population where these movies were made is ${totalPopulus}`;
                })
                .catch(() => {
                  resultPopulus.innerText = "Could not find country where movie was made";
                });
            });
          })
          .catch(() => {
            resultMinutes.innerText = "Please enter valid data!";
          });
      }
    }
  });
}

export { threeMovies };
