'use strict'

const promise = require("bluebird");
const moment = require('moment');
const globalSettingsLogic = require("../../logic/globalsettings");

exports.GetStartPage = (req, res) => {
    let { language } = req;
    let bucket = ""
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsForStartPage(bucket)
        .then(generals => {
            res.render('startpage/startpage', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Sales: generals.Sales,
                News: generals.News,
                Blogs: generals.Blogs,
                Branches: generals.Branches,
                Comments: generals.Comments,
                RecommendedList: generals.RecommendedList,
                Carousel: generals.Carousel.Data,
                Page: generals.StartPage.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language 

            });
        })
};

exports.GetAboutUsPage = (req, res) => {
    let { language } = req;
    let bucket = ""
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "aboutus", bucket)
        .then(generals => {
            res.render('aboutuspage/aboutus', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
};

exports.GetProjectContactPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "projectcontact", bucket)
        .then(generals => {
            res.render('projectcontactpage/projectcontact', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
};

exports.GetArchitectsContactPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "architectscontact", bucket)
        .then(generals => {
            res.render('architectscontactpage/architectscontact', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
};

exports.GetSalesPage = (req, res) => {
    const { index } = req.params;
    let { language } = req;
    let bucket = ""
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsAndPageByIndex(bucket + "sales", Number(index), bucket)
        .then(generals => {
            res.render('salespage/sales', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetBlogPage = (req, res) => {
    const { index } = req.params;
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsAndPageByIndex(bucket + "blogslist", Number(index), bucket)
        .then(generals => {
            res.render('blogspage/blogs', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetBlogsListPage = (req, res) => {
    const { page, partial } = req.query;
    let { language } = req;
    let arrayReq = []
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    if (page && partial) {
        arrayReq.push(globalSettingsLogic.GetPartialByPageAndLimit(bucket + "blogslist", (6 * Number(page) || 1) - 5, 6))
    }
    else if (page) {
        arrayReq.push(globalSettingsLogic.GetGlobalSettingsListByPage(bucket + "blogslist", bucket + 'blogs', (6 * Number(page) || 1) - 5, 6, bucket));
        arrayReq.push(globalSettingsLogic.GetCountOfBucket(bucket + 'blogslist'))
    }
    else {
        arrayReq.push(globalSettingsLogic.GetGlobalSettingsList(bucket + "blogslist", bucket + 'blogs', 6, bucket));
        arrayReq.push(globalSettingsLogic.GetCountOfBucket(bucket + 'blogslist'))
    }
    return promise.all(arrayReq)
        .then(([generals, countBlogs]) => {
            if (partial) {
                res.render('blogslistpage/blogslist', { Blogs: generals, Partial: true, moment, PageNumber: page, Desktop: (req.device.type == 'desktop' ? true : false), Language: language })
            } else if (!generals.PageList || !generals.PageList.length) {
                res.redirect('/blogs?page=1')
            } else {
                let countPages = (parseInt(countBlogs / 6) + (countBlogs % 6 > 0 ? 1 : 0))
                res.render('blogslistpage/blogslist', {
                    Desktop: (req.device.type == 'desktop' ? true : false),
                    Url: ('https://www.pandoor.co.il' + req.url),
                    moment,
                    Navigation: generals.Navigation,
                    Footer: generals.Footer,
                    Branches: generals.Branches,
                    Blogs: generals.PageList,
                    Page: generals.Page.Data,
                    CountPages: countPages,
                    PixelsAndNav: generals.PixelsAndNav.Data,
                    Partial: false,
                    PageNumber: page || 1,
                    Language: language
                });
            }
        })
}

exports.GetContactPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsContacts(bucket)
        .then(generals => {
            res.render('contactpage/contact', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Installers: generals.Installers,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetArchitectsListPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsList(bucket + "architectslist", bucket + "architectslistpage", 200, bucket)
        .then(generals => {
            res.render('architectslistpage/architectslist', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Architects: generals.PageList.sort((a, b) => {
                    if (a.Data.Name < b.Data.Name) { return -1; }
                    if (a.Data.Name > b.Data.Name) { return 1; }
                    return 0;
                }),
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetPrivacyPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "privacy", bucket)
        .then(generals => {
            res.render('privacypage/privacy', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetCommentsPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsList(bucket + "commentslist", bucket + "comments", 50, bucket)
        .then(generals => {
            res.render('commentspage/comments', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Comments: generals.PageList,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetBranchesPage = (req, res) => {
    const { index } = req.params;
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "branches", bucket)
        .then(generals => {
            res.render('branchespage/branches', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                IndexBranchOnload: index || 0,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetVideoPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "video", bucket)
        .then(generals => {
            res.render('videopage/video', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetCatalogPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "catalog", bucket)
        .then(generals => {
            res.render('catalogpage/catalog', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetDoorPage = (req, res) => {
    const { index } = req.params;
    const { modelid } = req.query;
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    let generals;
    globalSettingsLogic.GetGlobalSettingsAndPageByIndex(bucket + "doors", Number(index), bucket)
        .then(generalsDB => {
            generals = generalsDB;
            return promise.all([globalSettingsLogic.GetPageById(generals.Page.Data.Collection, bucket + "doorcollectionlist"),
            globalSettingsLogic.GetPageProd(bucket + 'gallery'), globalSettingsLogic.GetPageProd(bucket + 'pirzul')])
        })
        .then(([collection, gallery, pirzul]) => {
            res.render('doorpage/door', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Collection: collection.Data,
                CheckedModal: modelid,
                Gallery: (gallery && gallery.Data.Content.ContentImages.length ? gallery.Data.Content.ContentImages.splice(0, 3) : []),
                Pirzul: pirzul.Data.Pirzul,
                Language: language
            });
        })
}

exports.GetProjectPage = (req, res) => {
    const { index } = req.params;
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    if (index) {
        globalSettingsLogic.GetGlobalSettingsAndPageById(index, bucket + "projects", bucket)
            .then(generals => {
                res.render('projectpage/project', {
                    Desktop: (req.device.type == 'desktop' ? true : false),
                    Url: ('https://www.pandoor.co.il' + req.url),
                    moment,
                    Navigation: generals.Navigation,
                    Footer: generals.Footer,
                    Branches: generals.Branches,
                    Page: generals.Page.Data,
                    PixelsAndNav: generals.PixelsAndNav.Data,
                    Language: language
                });
            })
    } else {
        res.sendStatus(404)
    }
}

exports.GetArchitectPage = (req, res) => {
    const { id } = req.params;
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettingsArchitectPage(id, bucket)
        .then(generals => {
            res.render('architectpage/architect', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Architect: generals.Architect.Data,
                Projects: generals.Projects,
                Page: {
                    MetaData: generals.Architect.Data.MetaData,
                    Header: generals.Architect.Data.Header,
                },
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}

exports.GetGalleryPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + 'gallery', bucket)
        .then(generals => {
            res.render('gallerypage/gallery', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}


exports.GetAccessibilityStatementPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + "accessibilitystatement", bucket)
        .then(generals => {
            res.render('accessibilitystatementpage/accessibilitystatement', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}


exports.GetPirzulPage = (req, res) => {
    let { language } = req;
    let bucket = "";
    if (language) {
        bucket = language + "_";
        language = "/" + language;
    }
    globalSettingsLogic.GetGlobalSettings(bucket + 'pirzullist', bucket)
        .then(generals => {
            res.render('pirzulpage/pirzul', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}



exports.GetDesignersBlogsListPage = (req, res) => {
    const { page, partial } = req.query;
    let arrayReq = []
    if (page && partial) {
        arrayReq.push(globalSettingsLogic.GetPartialByPageAndLimit("designersblogslist", (6 * Number(page) || 1) - 5, 6))
    }
    else if (page) {
        arrayReq.push(globalSettingsLogic.GetGlobalSettingsListByPage("designersblogslist", 'designersblogs', (6 * Number(page) || 1) - 5, 6));
        arrayReq.push(globalSettingsLogic.GetCountOfBucket('designersblogslist'))
    }
    else {
        arrayReq.push(globalSettingsLogic.GetGlobalSettingsList("designersblogslist", 'designersblogs', 6));
        arrayReq.push(globalSettingsLogic.GetCountOfBucket('designersblogslist'))
    }
    return promise.all(arrayReq)
        .then(([generals, countBlogs]) => {
            if (partial) {
                res.render('designersblogspage/designersblogs',{Blogs : generals, Partial:true,  moment, PageNumber:page, Desktop: (req.device.type == 'desktop' ? true : false), Language: language})
            } else if(!generals.PageList || !generals.PageList.length){
                res.redirect('/blogs?page=1')
            }else{
                let countPages = (parseInt(countBlogs / 6 ) + (countBlogs % 6 > 0 ? 1 : 0))
                res.render('designersblogslistpage/designersblogslist', {
                    Desktop: (req.device.type == 'desktop' ? true : false),
                    Url: ('https://www.pandoor.co.il' + req.url),
                    moment,
                    Navigation: generals.Navigation,
                    Footer: generals.Footer,
                    Branches: generals.Branches,
                    Blogs: generals.PageList,
                    Page: generals.Page.Data,
                    CountPages: countPages,
                    PixelsAndNav: generals.PixelsAndNav.Data,
                    Partial:false,
                    PageNumber: page || 1,
                    Language: language
                });
            }
        })
}

exports.GetDesignersBlogPage = (req, res) => {
    const { index } = req.params;
    globalSettingsLogic.GetGlobalSettingsAndPageByIndex("designersblogslist", Number(index))
        .then(generals => {
            res.render('designersblogpage/designersblog', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Url: ('https://www.pandoor.co.il' + req.url),
                moment,
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Branches: generals.Branches,
                Page: generals.Page.Data,
                PixelsAndNav: generals.PixelsAndNav.Data,
                Language: language
            });
        })
}