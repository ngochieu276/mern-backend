const New = require("../../models/new");
const User = require("../../models/user");
const nodemailer = require("nodemailer");

const getReceiveEmail = async () => {
  let userList = await User.find({
    $and: [{ receivedEmail: true }, { role: "user" }],
  });

  let emailList = userList.map((user) => user.email);
  return emailList;
};

const sendEmai = (emailReceived, title, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: { rejectUnauthorized: false },
    auth: {
      user: "ngochieustudy@gmail.com",
      pass: "sieunhangao",
    },
  });

  const mailOptions = {
    from: "ngochieustudy@gmail.com",
    to: emailReceived,
    subject: title,
    html: content,
  };

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(
        "Email sent: " + response.envelope.from + response.envelope.to
      );
    }
  });
};

exports.sendNew = async (req, res) => {
  const { newContent, newTitle } = req.body;
  const emailList = await getReceiveEmail();
  let emailListString = emailList.join(", ");
  console.log(emailListString);
  const newLetter = new New({
    title: newTitle,
    new: newContent,
    receiver: emailList,
    createdBy: req.user._id,
  });
  newLetter.save((err, newletter) => {
    if (err) return res.status(400).json({ err });
    if (newletter) {
      sendEmai(emailListString, newLetter.title, newletter.new);
      return res.status(201).json({ newLetter });
    }
  });
};

exports.getNews = (req, res) => {
  New.find({})
    .sort({ createdAt: -1 })
    .populate("createdBy")
    .exec((error, news) => {
      if (error) return res.status(400).json({ error });
      if (news) return res.status(200).json({ news });
    });
};

exports.getNewById = (req, res) => {
  const { newId } = req.params;
  if (newId) {
    New.findOne({ _id: newId }).exec((error, newLetter) => {
      if (error) return res.status(400).json({ error });
      if (newLetter) return res.status(200).json({ newLetter });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
