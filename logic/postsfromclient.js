'use strict'

const promise = require("bluebird");
const pages = require("../data/pages");
const uploadImage = require('../logic/imagesbucket').UploadNewImage

const textValidation = text => {
    let regex = /[^a-zA-Zא-ת0-9А-Яа-я\_ ]/g
    return (text.replace(regex, ''));
}


const validateForCellularPhone = phoneNumber => {
    if ((typeof phoneNumber == 'undefined') || (phoneNumber == null) || (phoneNumber == "")) {
        return ''
    } else {
        phoneNumber = phoneNumber.replace(/[\D]/g, '')
        let validHomePhone = phoneNumber.match(/^(02|03|04|08|09)([0-9]{7})$/g)
        let validCellPhone = phoneNumber.match(/^(05|07)([0-9]{8})$/g)
        if (validCellPhone) {
            return validCellPhone[0]
        } else if (validHomePhone) {
            return validHomePhone[0]
        }
        return ''
    }
};


const validateEmail = email => {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))([ ]?,[ ]?(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))*$/;
    return (regex.test(email) ? email : '');
}



const PostClientComment = (name, phoneNumber, email, city, content) => {
    let newComment = {
        Name: textValidation(name),
        City: textValidation(city),
        Comment: textValidation(content),
        PhoneNumber: validateForCellularPhone(phoneNumber),
        Email: validateEmail(email),
        ProfileImage: process.env.LINKTOBUCKETS + "default/default_client_comments_icon.png"
    }

    if (newComment.Email && newComment.Name && newComment.City && newComment.Comment) {
        return pages.SetNewPage(newComment, 'commentslist');
    } else {
        return promise.reject(new Error("One or few fields not evadable"));
    }
}

const PostNewProject = (name, phoneNumber, email, city, content) => {
    let newApplicant = {
        "Name": textValidation(name),
        "City": textValidation(city),
        "Request": textValidation(content),
        "PhoneNumber": validateForCellularPhone(phoneNumber),
        "Email": validateEmail(email),
        "TypeRequest": "project",
        "Active": true
    }

    if (newApplicant.Email && newApplicant.Name && newApplicant.City && newApplicant.Request) {
        return pages.SetNewPage(newApplicant, 'projectapplicant');
    } else {
        return promise.reject(new Error("One or few fields not evadable"));
    }
}

const PostNewArchitect = (name, phoneNumber, email, city, content) => {
    let newApplicant = {
        "Name": textValidation(name),
        "City": textValidation(city),
        "Request": textValidation(content),
        "PhoneNumber": validateForCellularPhone(phoneNumber),
        "Email": validateEmail(email),
        "TypeRequest": "architect",
        "Active": true
    }

    if (newApplicant.Email && newApplicant.Name && newApplicant.City && newApplicant.Request) {
        return pages.SetNewPage(newApplicant, 'architectapplicant');
    } else {
        return promise.reject(new Error("One or few fields not evadable"));
    }
}

const PostNewArchitectBlank = (form, file) => {
    let newApplicant = {
        "Name": textValidation(form.Name),
        "City": textValidation(form.City),
        "Request": textValidation(form.Content),
        "PhoneNumber": validateForCellularPhone(form.PhoneNumber),
        "PhoneNumber2": validateForCellularPhone(form.PhoneNumber2),
        "Email": validateEmail(form.Email),
        "TypeRequest": "architectblank",
        "Active": true
    }
    if (newApplicant.Email && newApplicant.Name && newApplicant.City && newApplicant.Request) {
        return uploadImage(file, 'architectsblankavatars')
            .then(imageName => {
                if (imageName) {
                    newApplicant.LinkImage = imageName;
                    return pages.SetNewPage(newApplicant, 'architectblankapplicant')
                }else{
                    return false
                }
            })
    } else {
        return promise.reject(new Error("One or few fields not evadable"));
    }
}



module.exports = {
    PostClientComment,
    textValidation,
    validateForCellularPhone,
    validateEmail,
    PostNewProject,
    PostNewArchitect,
    PostNewArchitectBlank
}