//* octokit for gh api
import { Octokit } from "https://esm.sh/@octokit/core";
const octokit = new Octokit({});

//* global variables
// div that contains the profile info
const profileInfo = document.querySelector(".overview");
// gh username
const username = "ang-riv";
// ul
const repoList = document.querySelector(".repo-list");
// repo section
const repoSection = document.querySelector(".repos");
// individual repo data
const individualRepoData = document.querySelector(".repo-data");
// back to gallery btn
const backButton = document.querySelector(".view-repos");
// selects the input in the search bar
const filterInput = document.querySelector(".filter-repos");

//* async fcn to retrieve gh data
const getGHData = async function () {
  // since this is already an object, don't need to convert to a json file?
  const ghData = await octokit.request("GET /users/{username}", {
    username: username,
  });

  displayInfo(ghData);
  //return request;
};

getGHData();

//* fcn to display user's profile info
const displayInfo = function (objectData) {
  const data = objectData.data;
  // retrieving specific user data
  const img = data.avatar_url;
  const name = data.name;
  const bio = data.bio;
  const location = data.location;
  const repos = data.public_repos;

  // new div that will contain the user's info
  let userInfo = document.createElement("div");
  userInfo.classList.add("user-info");

  // populate the div
  userInfo.innerHTML = `<figure>
      <img alt="user avatar" src=${img} />
        </figure>
        <div>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Bio:</strong> ${bio}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Number of public repos:</strong> ${repos}</p>
        </div>`;

  // append to the overview div
  profileInfo.append(userInfo);
  // fetch the repos
  getRepos();
};

//* async fcn to fetch repos
const getRepos = async function () {
  const repoData = await octokit.request("GET /users/{username}/repos", {
    username: username,
    sort: "updated",
    per_page: 100,
  });

  displayRepoInfo(repoData);
};

//* fcn that displays the repos
const displayRepoInfo = function (repos) {
  // show the input bar
  filterInput.classList.remove("hide");
  // loop through each repo
  // access the array that contains all of the repos
  const repoData = repos.data;
  for (let singleRepo of repoData) {
    let repoNames = singleRepo.name;
    // create a list item for each repo
    let repoItem = document.createElement("li");

    // give them repo class and h3 with repo name
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repoNames}</h3>`;
    repoList.append(repoItem);
  }
};

//* event listener for clicking on each repo and displaying the repos info
repoList.addEventListener("click", function (e) {
  // check if the event target (element being clicked on) matches the h3 element
  if (e.target.matches("h3")) {
    // name of the repo
    const repoName = e.target.innerText;
    getSpecificRepoInfo(repoName);
  }
});

//* async fcn to get specific repo info
const getSpecificRepoInfo = async function (repoName) {
  const specificRepoData = await octokit.request("GET /repos/{owner}/{repo}", {
    owner: username,
    repo: repoName,
  });

  console.log(specificRepoData);

  // grab the url
  const fetchLanguages = await specificRepoData.data.languages_url;
  // grab the data from the url
  const languagesURL = await fetch(fetchLanguages);
  // parse the languages in to json file
  const languageData = await languagesURL.json();

  // add languages into an array
  const languages = [];
  for (const key in languageData) {
    languages.push(key);
  }

  console.log(languages);
  console.log(languageData);
  displaySpecificRepoInfo(specificRepoData, languages);
};

//* fcn that displays a specific repos info
const displaySpecificRepoInfo = async function (repoInfo, languages) {
  // empty the section where the individual repo data will be
  individualRepoData.innerHTML = "";

  // get info
  const data = repoInfo.data;
  const name = data.name;
  const description = data.description;
  const defaultBranch = data.default_branch;
  const url = data.html_url;

  // create a new div
  const div = document.createElement("div");
  // populate the div
  div.innerHTML = `<h3>Name: ${name}</h3>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Default Branch:</strong> ${defaultBranch}</p>
    <p><strong>Languages:</strong> ${languages.join(", ")}</p>
    <a class="visit" href="${url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

  // add div to individual repo data
  individualRepoData.append(div);

  individualRepoData.classList.remove("hide");
  repoSection.classList.add("hide");
  // get rid of back button
  backButton.classList.remove("hide");
};

//* event listener for back to repo button
backButton.addEventListener("click", function () {
  repoSection.classList.remove("hide");
  individualRepoData.classList.add("hide");
  backButton.classList.add("hide");
});

//* event listener for dynamic search bar
filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const lowercaseSearch = searchText.toLowerCase();
  console.log(lowercaseSearch);
  // select all the elements that have class of repo
  const repos = document.querySelectorAll(".repo");

  // loop through each repo inside of the repos element
  for (let i = 0; i < repos.length; i++) {
    const element = repos[i];
    const repoNames = element.innerText;
    const lowercaseRepo = repoNames.toLowerCase();
    // if the lowercase repo text includes the lowercase search text like substrings from the last project, show the repo. if not, add hide to the classlist.
    if (lowercaseRepo.includes(lowercaseSearch)) {
      element.classList.remove("hide");
    } else {
      element.classList.add("hide");
    }
  }
});
