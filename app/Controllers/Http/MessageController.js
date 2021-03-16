"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Message = use("App/Models/Message");

/**
 * Resourceful controller for interacting with messages
 */
class MessageController {
  /**
   * Show a list of all messages.
   * GET messages
   */
  async index() {
    const messages = await Message.query().with("user").fetch();

    return messages;
  }

  /**
   * Create/save a new message.
   * POST messages
   */
  async store({ request, auth }) {
    const data = request.only(["content"]);

    const message = await Message.create({ user_id: auth.user.id, ...data });

    return message;
  }

  /**
   * Display a single message.
   * GET messages/:id
   */
  async show({ params }) {
    const message = await Message.query()
      .where("user_id", "=", params.id)
      .with("user")
      .fetch();

    return message;
  }

  /**
   * Delete a message with id.
   * DELETE messages/:id
   */
  async destroy({ params, auth, response }) {
    const message = await Message.findOrFail(params.id);

    if (message.user_id !== auth.user.id) {
      return response.status(401);
    }

    await message.delete();
  }
}

module.exports = MessageController;
