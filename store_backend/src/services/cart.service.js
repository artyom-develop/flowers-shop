const CartModel = require("../models/cart.model");
const mongoose = require("mongoose");

class CartService {
    static async getCart(user, sessionId) {
        console.log('CartService.getCart called with user:', user?.id, 'sessionId:', sessionId);
        let cartModel;
        if (user && user.id) {
            cartModel = await CartModel.findOne({user: user.id}).populate({path: 'items.product'});
            console.log('Found cart by user:', cartModel?._id);
            if (!cartModel && sessionId) {
                cartModel = await CartModel.findOne({sessionId: sessionId}).populate({path: 'items.product'});
                console.log('Found cart by session (migrating to user):', cartModel?._id);
                if (cartModel) {
                    cartModel.sessionId = null;
                    cartModel.user = new mongoose.Types.ObjectId(user.id);
                    await cartModel.save();
                }
            }
        } else if (sessionId) {
            cartModel = await CartModel.findOne({sessionId: sessionId}).populate({path: 'items.product'});
            console.log('Found cart by session:', cartModel?._id, 'sessionId:', cartModel?.sessionId);
        }

        if (!cartModel) {
            console.log('Creating new cart for sessionId:', sessionId);
            cartModel = new CartModel({items: []});
            if (user) {
                cartModel.user = new mongoose.Types.ObjectId(user.id);
            } else if (sessionId) {
                cartModel.sessionId = sessionId;
            }
            await cartModel.save();
            console.log('New cart created with ID:', cartModel._id, 'sessionId:', cartModel.sessionId);
        }

        return cartModel;
    }

    static async clearCart(cart) {
        cart.items = [];
        await cart.save();
    }
}

module.exports = CartService;