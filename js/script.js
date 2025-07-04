//* octokit for gh api
import { Octokit } from "https://esm.sh/@octokit/core";
const octokit = new Octokit({});

//* global variables
const profileInfo = document.querySelector(".overview");
const username = "ang-riv";
const repoList = document.querySelector(".repo-list");
const repoSection = document.querySelector(".repos");
const individualRepoData = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

//* async fcn to retrieve gh data
const getGHData = async function () {
  const ghData = await octokit.request("GET /users/{username}", {
    username: username,
  });

  displayInfo(ghData);
};

getGHData();

//* fcn to display user's profile info
const displayInfo = function (objectData) {
  const data = objectData.data;
  const img = data.avatar_url;
  const name = data.name;
  const bio = data.bio;
  const location = data.location;
  const repos = data.public_repos;

  let userInfo = document.createElement("div");
  userInfo.classList.add("user-info");

  userInfo.innerHTML = `<figure>
      <img alt="user avatar" src=${img} />
        </figure>
        <div>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Bio:</strong> ${bio}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Number of public repos:</strong> ${repos}</p>
        </div>`;

  profileInfo.append(userInfo);
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
  filterInput.classList.remove("hide");
  const repoData = repos.data;
  for (let singleRepo of repoData) {
    let repoNames = singleRepo.name;
    let repoItem = document.createElement("li");

    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h2 role="button" tabindex="0">${repoNames}</h2>`;
    repoList.append(repoItem);
  }
};

//* event listener for clicking/selecting each repo and displaying the repos info
repoList.addEventListener("click", function (e) {
  if (e.target.matches("h2")) {
    const repoName = e.target.innerText;
    getSpecificRepoInfo(repoName);
  }
});

repoList.addEventListener("keydown", function (e) {
  if (e.target.matches("h2") && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
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

  const fetchLanguages = await specificRepoData.data.languages_url;
  const languagesURL = await fetch(fetchLanguages);
  const languageData = await languagesURL.json();

  const languages = [];
  for (const key in languageData) {
    languages.push(key);
  }

  displaySpecificRepoInfo(specificRepoData, languages);
};

//* fcn that displays a specific repos info
const displaySpecificRepoInfo = async function (repoInfo, languages) {
  individualRepoData.innerHTML = "";

  const data = repoInfo.data;
  const name = data.name;
  const description = data.description;
  const defaultBranch = data.default_branch;
  const url = data.html_url;

  const div = document.createElement("div");
  div.innerHTML = `<h2>Name: ${name}</h2>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Default Branch:</strong> ${defaultBranch}</p>
    <p><strong>Languages:</strong> ${languages.join(", ")}</p>
    <a class="visit" href="${url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

  individualRepoData.append(div);

  individualRepoData.classList.remove("hide");
  repoSection.classList.add("hide");
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
  const repos = document.querySelectorAll(".repo");

  for (let i = 0; i < repos.length; i++) {
    const element = repos[i];
    const repoNames = element.innerText;
    const lowercaseRepo = repoNames.toLowerCase();
    if (lowercaseRepo.includes(lowercaseSearch)) {
      element.classList.remove("hide");
    } else {
      element.classList.add("hide");
    }
  }
});
