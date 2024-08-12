const shortid = require('shortid');
const URL = require('../models/url');
async function handleGenerateNewShortUrl(req,res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error:'url is required'});
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectURL:body.url,
        visitHistory: []
    });

    return res.render('home', {id:shortId});
    
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    console.log(`Received request for analytics with shortId: ${shortId}`);
    // Find the document with the given shortId
    const result = await URL.findOne({ shortId });
    console.log(`Database query result: ${result}`);
    // Check if the result is null (no document found)
    if (!result) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    // If the document is found, return the analytics data
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}


module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}