//* octokit for gh api
import { Octokit } from "https://esm.sh/@octokit/core";
const octokit = new Octokit({});

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

const displayInfo = function (objectData) {
  const data = objectData.data;

  const img = data.avatar_url;
  const name = data.name;
  const bio = data.bio;
  const location = data.location;
  const repos = data.public_repos;

  // new div that will contain the user's info
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

const getRepos = async function () {
  const repoData = await octokit.request("GET /users/{username}/repos", {
    username: username,
    sort: "updated",
    per_page: 100,
  });

  displayRepoInfo(repoData);
};

const displayRepoInfo = function (repos) {
  filterInput.classList.remove("hide");
  
  // access the array that contains all of the repos
  const repoData = repos.data;
  for (let singleRepo of repoData) {
    let repoNames = singleRepo.name;
    let repoItem = document.createElement("li");

    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repoNames}</h3>`;
    repoList.append(repoItem);
  }
};

//* event listener for clicking on each repo and displaying the repos info
repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getSpecificRepoInfo(repoName);
  }
});

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

  console.log(languages);
  console.log(languageData);
  displaySpecificRepoInfo(specificRepoData, languages);
};

const displaySpecificRepoInfo = async function (repoInfo, languages) {
  individualRepoData.innerHTML = "";

  const data = repoInfo.data;
  const name = data.name;
  const description = data.description;
  const defaultBranch = data.default_branch;
  const url = data.html_url;

  const div = document.createElement("div");
  
  div.innerHTML = `<h3>Name: ${name}</h3>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Default Branch:</strong> ${defaultBranch}</p>
    <p><strong>Languages:</strong> ${languages.join(", ")}</p>
    <a class="visit" href="${url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

  individualRepoData.append(div);

  individualRepoData.classList.remove("hide");
  repoSection.classList.add("hide");
  backButton.classList.remove("hide");
};

backButton.addEventListener("click", function () {
  repoSection.classList.remove("hide");
  individualRepoData.classList.add("hide");
  backButton.classList.add("hide");
});

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
