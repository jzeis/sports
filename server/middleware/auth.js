import jwt from 'jsonwebtoken';

const secret = 'test';

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		let decodedData;
		if (token) {      
			decodedData = jwt.verify(token, secret);

			req.userId = decodedData?.id;
			req.userName = decodedData?.name;
			next();
		} 
		else {
			throw 'No Token';
		}

	} catch (error) {
		res.status(401).json({
			error: new Error(error)
		});
	}
};

export default auth;
