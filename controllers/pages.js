const fs = require('fs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const sendgrid_api_key = '';

const transport = nodemailer.createTransport(
    sendGridTransport({
        auth: { api_key: sendgrid_api_key },
    })
);


exports.getIndex = async (req, res) => {
    const context = { title: "Wabomba Bakar", path: "/" };
    res.render("index", context);
}


exports.getAbout = async (req, res) => {
    const context = { title: "Wabomba Bakar | About Me", path: "/about" };
    res.render("about", context);
}


exports.getPortfolio = async (req, res) => {
    const context = { title: "Wabomba Bakar | Portfolio", path: "/portfolio" };
    res.render("portfolio", context);
}


exports.getContact = async (req, res) => {
    const context = { title: "Wabomba Bakar | Contact Me", path: "/contact" };
    res.render("contact", context);
}

exports.postContact = async (req, res) => {
    const { name, email, subject, phone, message } = req.body
    // await transport.sendMail({
    //     to: 'wabombabakar@gmail.com',
    //     from: `${name} -- ${email} -- ${phone}`,
    //     subject: `${subject} - ${message}`
    // });

    console.log(req.body)
    res.redirect('/')
    req.flash("success", "Message sent successfully.");
}

exports.getBlog = async (req, res) => {
    const context = { title: "Wabomba Bakar | Blog", path: "/blog" };
    res.render("blog", context);
}