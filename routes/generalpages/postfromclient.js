'use strict'

const promise = require("bluebird");
const moment = require('moment');
const postsFromClient = require("../../logic/postsfromclient");
const globalSettingsLogic = require("../../logic/globalsettings");
const request = promise.promisifyAll(require('request'))

exports.PostNewClientComment = (req, res) => {
    const { Name, PhoneNumber, Email, City, Content } = req.body;
    if (Name && City && Content) {
        postsFromClient.PostClientComment(Name, PhoneNumber, Email, City, Content)
            .then(() => {
                res.status(200).send("תודה רבה על תגובה");
                return;
            })
            .catch(err => {
                res.status(501).send("התרחשה שגיאה")
                return;
            })
    } else {
        res.status(403).send("לא כל השדות מלאים!")
    }
}


let SchemaLeadPriceOffers = function (internetLead) {
    return {
        CampaignCode: internetLead.FromPage || "אתר פנדור",
        Phone: postsFromClient.validateForCellularPhone(internetLead.PhoneNumber),
        Email: postsFromClient.validateEmail(internetLead.Email),
        City: postsFromClient.textValidation(internetLead.City),
        Name: postsFromClient.textValidation(internetLead.Name),
        numberOfDoors: ""
    }
}



exports.PostNewClientPriceOffer = (req, res) => {
    let newLead = SchemaLeadPriceOffers(req.body);
    if ((newLead.Phone || newLead.Email) && newLead.Name) {
        return request.postAsync({
            method: 'POST',
            uri: process.env.SEND_TO_CRM + "leads/addlead?access_token=2B8C3475-181E-472A-8432-D5DB35DCDB12",
            timeout: 10000,
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: newLead
        })
            .then((response) => {
                if (response.statusCode !== 200) {
                    if (req.headers.referer.includes('pandoorwebmedia')) {
                        res.redirect(req.headers.referer + '?sent=false')
                    } else {
                        res.status(501).send("התרחשה שגיאה")
                    }
                }
                else {
                    if (req.headers.referer.includes('pandoorwebmedia')) {
                        res.redirect(req.headers.referer + '?sent=true')
                        return postsFromClient.BackUpLeadsAndServices(newLead, 'lead')
                    } else {
                        res.status(200).send("תודה לפנייתך, סוכן מחירות יחזור אלך בהמשך! ")
                        return postsFromClient.BackUpLeadsAndServices(newLead, 'lead')
                    }
                }
            })
            .catch(err => {
                if (req.headers.referer.includes('pandoorwebmedia')) {
                    res.redirect(req.headers.referer + '?sent=false')
                } else {
                    res.status(501).send("התרחשה שגיאה")
                }
            })
    } else {
        if (req.headers.referer.includes('pandoorwebmedia')) {
            res.redirect(req.headers.referer + '?error=fields')
        } else {
            res.status(403).send("לא כל השדות מלאים!")
        }
    }
}


let SchemaWebServiceCall = function (serviceCall) {
    return {
        CreatorName: "www.pandoor.co.il",
        CustomerPhone: postsFromClient.validateForCellularPhone(serviceCall.PhoneNumber),
        CustomerEmail: postsFromClient.validateEmail(serviceCall.Email),
        CustomerAddress: postsFromClient.textValidation(serviceCall.City),
        CustomerName: postsFromClient.textValidation(serviceCall.Name),
        Content: postsFromClient.textValidation(serviceCall.Content),

    }
}

exports.PostNewClientService = (req, res) => {
    let newServiceCall = SchemaWebServiceCall(req.body);
    if (newServiceCall.CustomerPhone && newServiceCall.CustomerName) {
        return request.postAsync({
            method: 'POST',
            uri: process.env.SEND_TO_CRM + "webservicecalls/add?access_token=65b2c100-efed-45ca-a453-e74a437332ba",
            timeout: 10000,
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: newServiceCall
        })
            .then((response) => {
                if (response.statusCode !== 200) {
                    res.status(501).send("התרחשה שגיאה")
                }
                else {
                    res.status(200).send("תודה לפנייתך, נציג שירות יחזור אלך בהמשך! ")
                    newServiceCall.ContentClient = newServiceCall.Content
                    delete newServiceCall.Content
                    return postsFromClient.BackUpLeadsAndServices(newServiceCall, 'service')
                }
            })
            .catch(err => {
                res.status(501).send("התרחשה שגיאה")
            })
    } else {
        res.status(403).send("לא כל השדות מלאים!")
    }
}


exports.PostNewProject = (req, res) => {
    const { Name, PhoneNumber, Email, City, Content } = req.body;
    if (Name && City && Content) {
        postsFromClient.PostNewProject(Name, PhoneNumber, Email, City, Content)
            .then(() => {
                res.status(200).send("תודה רבה על תגובה");
                return;
            })
            .catch(err => {
                res.status(501).send("התרחשה שגיאה")
                return;
            })
    } else {
        res.status(403).send("לא כל השדות מלאים!")
    }
}


exports.PostNewArchitect = (req, res) => {
    const { Name, PhoneNumber, Email, City, Content } = req.body;
    if (Name && City && Content) {
        postsFromClient.PostNewArchitect(Name, PhoneNumber, Email, City, Content)
            .then(() => {
                res.status(200).send("תודה רבה על תגובה");
                return;
            })
            .catch(err => {
                res.status(501).send("התרחשה שגיאה")
                return;
            })
    } else {
        res.status(403).send("לא כל השדות מלאים!")
    }
}

function validateToken(token) {
    return (token == process.env.TOKEN) || false;
}

exports.GetPageForArchitectsBlank = (req, res) => {
    const { token } = req.query;
    if (validateToken(token)) {
        res.render("architectsblank/architectsblank.ejs", {
            Desktop: (req.device.type == 'desktop' ? true : false),
            Token: process.env.TOKEN,
            Success: false,
            MulterError:false,
            Name:'',PhoneNumber:'',PhoneNumber2:'',Email:'',City:'',Content:''
        })
    } else {
        res.redirect("/");
    }
}

exports.PostNewArchitectBlank = (req, res) => {
    const { token } = req.query;
    const { ...body } = req.body;
    if (validateToken(token) && req.files && req.files.length) {
        postsFromClient.PostNewArchitectBlank(body, req.files[0])
            .then(result => {
                if (result) {
                    res.render("architectsblank/architectsblank.ejs", {
                        Desktop: (req.device.type == 'desktop' ? true : false),
                        Success: true,
                        Token: '',
                        MulterError:false
                    })
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.FinalSubmit = (req, res) => {
    globalSettingsLogic.GetGlobalSettings("xx")
        .then(generals => {
            res.render('finalsubmitpage/finalsubmit', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: { Header: { Title: "אנחנו מודים על פנייתכם" } },
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language:""
            });
        })
}