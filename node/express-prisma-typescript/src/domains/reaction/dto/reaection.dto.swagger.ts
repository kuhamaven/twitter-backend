/**
 * @swagger
 * components:
 *   schemas:
 *     ReactionTypeDTO:
 *       type: object
 *       properties:
 *         reactionType:
 *           type: string
 *           description: Type of reaction.
 *       example:
 *         reactionType: "Like"
 *
 *     ReactionDTO:
 *       type: object
 *       properties:
 *         reactionType:
 *           type: string
 *           description: Type of reaction.
 *         authorId:
 *           type: string
 *           description: ID of the user reacting to the post.
 *         postId:
 *           type: string
 *           description: ID of the post being reacted to.
 *       example:
 *         reactionType: "Like"
 *         authorId: "user123"
 *         postId: "post456"
 *
 *     ExtendedReactionDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/ReactionDTO'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: ID of the reaction.
 *           example:
 *             reactionType: "Like"
 *             authorId: "user123"
 *             postId: "post456"
 *             id: "reaction789"
 */
