'use strict';

const bcrypt = require('bcrypt');
const dataStore = require("../../data/connection").Datastore;

function extractProfile(profile) {
  return {
    id: profile.id,
    DisplayName: profile.displayName
  };
}

exports.AuthenticateUser = (accessToken, refreshToken, profile, cb) => {
  let query = dataStore.createQuery("users").filter('Email', '=', profile.emails[0].value)
  dataStore.runQuery(query, (err, result) => {
    if (err || !result.length) {
      cb(null, false)
    } else {
      bcrypt.compare(profile.id, result[0].id, function (err, res) {
        if (res) {
          cb(null, extractProfile(profile))
        } else {
          cb(null, false)
        }
      })
    }
  });
}

exports.CheckUser = (req, res, next) => {
  if (!req.user || !req.user.DisplayName) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
}

exports.AddTemplateVariables = (req, res, next) => {
  res.locals.profile = req.user;
  res.locals.login = `/auth/login?return=${encodeURIComponent(
    req.originalUrl
  )}`;
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(
    req.originalUrl
  )}`;
  next();
}


exports.Logout = (req, res) => {
  req.logout();
  res.redirect('/');
}