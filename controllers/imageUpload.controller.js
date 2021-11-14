const { bucket } = require("../firebase");

const imageUpload = async (req, res) => {
	if (!req.file) {
		res.status(400).send({
			success: 0,
			message: "No file",
		});
	}

	const blob = bucket.file(req.file.originalname);

	const blobWriter = blob.createWriteStream({
		metadata: {
			contentType: req.file.mimetype,
		},
	});

	blobWriter.on("error", (err) => {
		res.status(500).send({
			success: 0,
			message: err,
		});
	});

	blobWriter.on("finish", async () => {
		const imgUrl = await blob.getSignedUrl({
			action: "read",
			expires: "01-01-3000",
		});
		res.status(200).send({
			success: 1,
			data: imgUrl[0],
		});
	});

	blobWriter.end(req.file.buffer);
};

module.exports = { imageUpload };
