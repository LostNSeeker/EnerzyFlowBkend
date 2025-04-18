import { validationResult } from "express-validator";

export const validate = (validations) => {
	return async (req, res, next) => {
		// console.log("body in validater",req.body);
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(400).json({
			success: false,
			errors: errors.array().map((err) => ({
				field: err.param,
				message: err.msg,
			})),
		});
	};
};
