## UniJudge

UniJudge is a web app that determine the originality of project submissions on Devpost. It compiles a list of hackathon projects that a judge can use to verify whether a similar project has been done in the past by one of the same contributors. If there is a similarity in one of the past projects, the judge is able to view those projects and can view the links to those projects. The similarity analysis is done using Google Cloud's Natural Language Processing API.

## How to Run
* Clone this repo
* Set up Google cloud account and credentials for using NLP (https://cloud.google.com/natural-language/docs/setup)
* Add app name and credentials path in nlp.js
* Do npm install in root directory and client directory
* Run server using "node server.js" in root directory
* In client directory do npm start

## Challenges I Ran Into

Setting up the Google Cloud SDK for NLP 

## Built With
* React.js
* Express.js
* Node.js
* Google Cloud's NLP API
* Cheerio

## Inspiration
While searching for project ideas in devpost, I observed that many projects have been reused in different hackathons by same individual.

