var express = require("express");
var router = express.Router();

var scraper = require('./scraper');

router.get('/hackathons', async (req, res) => {
    let search = req.query.search;
    
    let projects = await scraper.searchProjectNames(search);
    res.status(200).send(projects);
});

router.get('/analyze-project', async (req, res) => {
    let link = req.query.link;
    console.log(link)
    let report = await scraper.analyzeProject(link);
    res.status(200).send(report);
});

router.get('/analyze-hackathon', async (req, res) => {
    let link = req.query.link;
    console.log(link)
    let reports = await scraper.generateHackathonReport(link);
    res.status(200).send(reports);
});


module.exports = router;
