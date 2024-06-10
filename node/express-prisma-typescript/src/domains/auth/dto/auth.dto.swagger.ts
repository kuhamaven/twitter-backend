/**
 * @swagger
 * components:
 *   schemas:
 *     SignupInputDTO:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         isPrivate:
 *           type: boolean
 *           description: Indicates if the user's profile is private
 *       example:
 *         email: user@example.com
 *         username: user123
 *         password: StrongP@ssw0rd
 *         isPrivate: false
 *     LoginInputDTO:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: user@example.com
 *         username: user123
 *         password: StrongP@ssw0rd
 *     TokenDTO:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token
 *       example:
 *         token: "jwt.token.here"
 */
