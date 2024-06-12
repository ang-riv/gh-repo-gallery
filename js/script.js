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


//* async fcn to retrieve gh data
const getGHData = async function () {
    // since this is already an object, don't need to convert to a json file?
    const ghData = await octokit.request('GET /users/{username}', {
        username: username,
    });

    displayInfo(ghData);
    //return request;
}

getGHData();

//* fcn to display user's profile info
const displayInfo = function (objectData) {
    // retrieving specific user data
    const img = objectData.data.avatar_url;
    const name = objectData.data.name;
    const bio = objectData.data.bio;
    const location = objectData.data.location;
    const repos = objectData.data.public_repos;

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
}

//* async fcn to fetch repos
const getRepos = async function () {
    const repoData = await octokit.request('GET /users/{username}/repos',{
        username: username,
        sort: "updated",
        per_page: 100
    });

    displayRepoInfo(repoData);
}

//* fcn that displays the repos
const displayRepoInfo = function(repos){
    // loop through each repo
    // access the array that contains all of the repos
    const repoData = repos.data;
    for(let singleRepo of repoData){
        let repoNames = singleRepo.name;
        // create a list item for each repo
        let listItem = document.createElement("li");

        // give them repo class and h3 with repo name
        listItem.classList.add("repo");
        listItem.innerHTML = `<h3>${repoNames}</h3>`;
        repoList.append(listItem);
    }
}