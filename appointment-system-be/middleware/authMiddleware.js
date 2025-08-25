const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
		req.user = decoded; // simpan payload JWT ke req.user

		// console.log("Authorization Header:", authHeader);
		// console.log("Decoded JWT:", decoded);

		next();
	} catch (err) {
		return res.status(403).json({ message: "Invalid or expired token." });
	}
};
