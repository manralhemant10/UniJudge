const axios = require("axios");
const cheerio = require("cheerio");

const nlp = require("./nlp");

const searchProjectNames = async (hackathonName) => {
  let url = `https://devpost.com/hackathons?&search=${hackathonName}&challenge_type=all&sort_by=Recently+Added`;

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  let rows = $("div.results .row");
  let projects = [];
  rows.each((index, el) => {
    let title = $(el).find("h2.title").text();
    let url = $(el).find("a.clearfix").attr("href");
    projects.push({
      title,
      url,
    });
  });

  return projects;
};

const generateHackathonReport = async (hackathonUrl) => {
  try {
    // url format = https://shellmakeathon.devpost.com/?ref_content=default&ref_feature=challenge&ref_medium=discover
    let regex = /https:\/\/.+.devpost.com/;
    let match = hackathonUrl.match(regex);

    //parse into just url = https://shellmakeathon.devpost.com/
    let url = match[0] + "/project-gallery";

    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    let pagination = $("ul.pagination");

    let pages = [];
    //if there is pagination on the page, promise All
    if (pagination.length > 0) {
      const lastPage = pagination.find("li").last().prev().text();

      for (let i = 1; i <= parseInt(lastPage); i++) {
        pages.push(axios.get(url + `?page=${i}`).then((res) => res.data));
      }
    }
    //only one page of submissions
    else {
      pages.push(axios.get(url).then((res) => res.data));
    }

    let reports = await Promise.all(pages).then(async(page) => {
        let reports = [];
        for(let i = 0; i < page.length; i++) {
            let data = page[i];
            let $ = cheerio.load(data);

            let promises = [];
            let info = [];
            $("div.gallery-item").each((index, elem) => {

                let projectTitle = $(elem).find("figcaption .software-entry-name > h5").text();
                let projectLink = $(elem).find("a.link-to-software").attr("href");
                let projectThumbnail = $(elem).find("img.software_thumbnail_image").attr("src");
                
                //for each gallery item analyze a project
                // let report = await analyzeProject(projectLink);
                promises.push(analyzeProject(projectLink));
                info.push({
                    title: projectTitle,
                    link: projectLink,
                    thumbnail: projectThumbnail,
                });
            });
            let promisedReports = await Promise.all(promises);
            let finishedReports = promisedReports.map((r, index) => {
                // console.log(r);
                return {
                    title: info[index].title,
                    link: info[index].link,
                    thumbnail: info[index].thumbnail,
                    contributors: r.contributors, //inlcude name and link
                    similarProjects: r.similarProjects,
                    description: r.description,
                }
            })
            reports = [...reports, ...finishedReports];
        }
        // console.log('all reports', reports.length );
        return reports;
      })
      .catch((err) => {
        console.log(err);
      });

    return reports;

  } catch (err) {
    console.log("error", err);
  }
};

async function analyzeProject(url) {
    try {
        console.log('analyzing...')
        const { data } = await axios.get(url);

        let $ = cheerio.load(data);
      
        let originalDescription = $("#app-details-left > div + div p").text();

        let contributorLinks = [];
        $("#app-team ul > li .row figure > a.user-profile-link").map((index, elem) => {
            contributorLinks.push($(elem).attr('href'));
        });
            
        let contributorPages = contributorLinks.map(link => axios.get(link).then(res => res.data));
        
        let similarProjects = await Promise.all(contributorPages).then(async contributor => {
            let similarProjects = [];
            // contributor.forEach(async (data, dataIndex) => {
            for(let k = 0; k < contributor.length; k++) {
                let data = contributor[k];
                const $ = cheerio.load(data);

                let pagination = $("ul.pagination");
                
                let pages = [];
                let pageUrl = contributorLinks[k];
                //if there is pagination on the page, promise All
                if (pagination.length > 0) {
                    const lastPage = pagination.find("li").last().prev().text();
            
                    for (let i = 1; i <= parseInt(lastPage); i++) {
                    pages.push(axios.get(pageUrl + `?page=${i}`).then((res) => res.data));
                    }
                }
                //only one page of submissions
                else {
                    pages.push(axios.get(pageUrl).then((res) => res.data));
                }

                let similarContributorProjects = await analyzeContributorProjects(pages, originalDescription, pageUrl, url);
                // Promise.all(analyzeContributorProjects(pages, originalDescription, pageUrl, url))
                // console.log(similarContributorProjects.length > 0 ? similarContributorProjects : null)
                similarProjects = [...similarProjects, ...similarContributorProjects];
                
            }
            // console.log('sim', similarProjects);
            return similarProjects;

        })
        .catch(err => {
            console.log(err);
        })

        let contributors = contributorLinks.map(link => {    
            const paths = link.split("/");
            let contributorName = paths[paths.length - 1];
            return contributorName;
        })


        let report = {
            similarProjects: similarProjects,
            contributors: contributors ? contributors : [],
            description: originalDescription
        };

        return report;
    }
    catch (err) {
        console.log(err);
    }
 
}

async function analyzeContributorProjects(pages, originalDescription, contributorLink, originalProjectLink) {
    try {
        const paths = contributorLink.split("/");
        let contributorName = paths[paths.length - 1];

        let similarProjects = await Promise.all(pages).then(async page => {
            let analyzedProjects = [];

            //Each page of contributor projects
            for(let i = 0; i < page.length; i++) {
                let data = page[i];
                let $ = cheerio.load(data);
                
                let nestedPromises = [];
                let info = [];
                //Go through all project cards
                $("div.gallery-item").each(async (index, elem) => {

                  let projectTitle = $(elem)
                    .find("figcaption .software-entry-name > h5")
                    .text();

                  let projectLink = $(elem).find("a.link-to-software").attr("href");

                  let projectThumbnail = $(elem)
                    .find("img.software_thumbnail_image")
                    .attr("src");
                
                    // console.log(projectLink, originalProjectLink);
                    if(projectLink != originalProjectLink) {   
                    
                        //for each gallery item analyze the contributor project and compare similarity
                        // let nestedProjectLink = axios.get(projectLink).then(res => res.data);
                        nestedPromises.push(axios.get(projectLink).then(res => res.data));
                        
                        info.push({
                            title: projectTitle,
                            contributor: {
                                name: contributorName,
                                link: contributorLink
                            },
                            thumbnail: projectThumbnail,
                            projectLink: projectLink,
                        })
                        
                    }
                  
                });
                
                let similarities = await Promise.all(nestedPromises).then(async pages => {
                    let similarities = [];
                    for(let k = 0; k < pages.length; k++) {
                        let page = pages[k];
                        let $ = cheerio.load(page);

                        let pastProjectDescription = $("#app-details-left > div p").text();
                        
                        let similarity = await nlp.compareDescriptionSimilarity(originalDescription, pastProjectDescription);
                        similarities.push(similarity);
                    }
                    return similarities;
                })

                similarities.forEach((similarity, idx) => {
                    if(similarity > 0.5) {
                        analyzedProjects.push({
                            ...info[idx],
                            similarity: similarity
                        });
                    }
                })
                
            }
            
            return analyzedProjects;
        })

        return similarProjects;
    }
    catch(err) {
        console.log(err);
    }
}


module.exports = {
  searchProjectNames,
  generateHackathonReport,
  analyzeProject
};
