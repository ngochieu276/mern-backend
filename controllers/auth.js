const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.register = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user) return res.status(400).json({ message: "User already register" });
  });

  const { email, password } = req.body;
  const hash_password = await bcrypt.hash(password, 10);

	const _user = new User({
		email,
		hash_password,
		role: "user",
	});
	console.log(_user);

  _user.save((error, data) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (data) {
      return res.status(200).json({
        message: "User create successfull",
				data: data,
      });
    }
  });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isValidPassword = user.authenticate(req.body.password);
      if (isValidPassword && user.role === "user") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

				const { _id, firstName, lastName, email, dob, phone, role } = user;

        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            dob,
            phone,
            role,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong " });
    }
  });
};

// exports.signout = (req, res) => {
//   res.clearCookie("token");
//   res.status(200).json({ message: "Signout successfully" });
//   console.log(res);
// };

exports.updateUser = async (req, res) => {
	const { _id } = req.user;
	const updateData = req.body;

	if (updateData.password) {
		const newPassword = await bcrypt.hash(updateData.password, 10);
		updateData.password = newPassword;
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
			new: true,
		}).select("-hash_password -__v -createdAt -updatedAt");

		res.status(200).send({
			success: 1,
			data: updatedUser,
			message: "User info updated",
		});
	} catch (err) {
		res.status(500).send({
			success: 0,
			message: err.message,
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		const user = req.user;

		res.status(200).send({
			success: 1,
			data: user,
		});
	} catch (err) {
		res.status(500).send({
			success: 0,
			message: err.message,
		});
	}
};
