'use strict'

const sm = require('sitemap');
const promise = require("bluebird");
const pages = require("../data/pages");
const moment = require("moment")
const fs = require("fs")

exports.GetSiteMapXML = (req, res) => {
    const sitemap = sm.createSitemap({
        hostname: global.Host,
        cacheTime: 600000,
        urls: []
    })

    sitemap.add({ url: '/', priority: 1.0, changefreq: 'weekly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/contact', priority: 0.8, changefreq: 'yearly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/branches', priority: 0.9, changefreq: 'yearly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/catalog', priority: 0.9, changefreq: 'yearly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/aboutus', priority: 0.6, changefreq: 'yearly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/gallery', priority: 0.6, changefreq: 'monthly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/architectscontact', priority: 0.5, changefreq: 'yearly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/comments', priority: 0.6, changefreq: 'weekly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/architectslist', priority: 0.7, changefreq: 'monthly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/video', priority: 0.5, changefreq: 'monthly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/privacy', priority: 0.5, changefreq: 'yearly',mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/blogs', priority: 0.6, changefreq: 'monthly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });
    sitemap.add({ url: '/projectcontact', priority: 0.5, changefreq: 'yearly', mobile: true, lastmodISO: moment(Number(process.env.DATE_LAST_MODIFY)).format("YYYY-MM-DD") });

    promise.all([
        pages.GetPageListProd("blogslist", 1000),
        pages.GetPageListProd('sales', 5),
        pages.GetPageListProd('architectslist', 1000),
        pages.GetPageListProd('projects', 1000)
    ])
        .then(([blogs, sales, architects, projects]) => {
            blogs.forEach(blog => sitemap.add({ url: '/blog/' + blog.Position, priority: 0.5, changefreq: 'yearly', mobile: true, lastmodISO: moment(blog.DateCreate).format("YYYY-MM-DD") }));
            sales.forEach(sale => sitemap.add({ url: '/sales/' + sale.Position, priority: 0.5, changefreq: 'monthly', mobile: true, lastmodISO: moment(sale.DateCreate).format("YYYY-MM-DD") }));
            architects.forEach(architect => sitemap.add({ url: '/architect/' + architect.Id, priority: 0.5, changefreq: 'yearly', mobile: true, lastmodISO: moment(architect.DateCreate).format("YYYY-MM-DD") }));
            projects.forEach(project => sitemap.add({ url: '/project/' + project.Id, priority: 0.5, changefreq: 'monthly', mobile: true, lastmodISO: moment(project.DateCreate).format("YYYY-MM-DD") }));

            sitemap.toXML((err, xml) => {
                if (err) {
                    return res.status(500).end();
                }
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            });
        })
}

exports.GetRobotTXT = (req, res) => {
    const text = fs.readFileSync('robot.txt')
    res.type('text/plain');
    res.send(text)
}