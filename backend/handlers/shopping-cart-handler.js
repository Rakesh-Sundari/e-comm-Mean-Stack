const Cart = require("./../db/cart");



async function addToCart(userId, productId, quantity) {

    console.log("Incoming quantity:", quantity, "Type:", typeof quantity);

    let product = await Cart.findOne({ userId: userId, productId: productId });
    if (product) {
        if (product.quantity + quantity <= 0) {
            await removefromCart(userId, productId);
        } else {
            await Cart.findByIdAndUpdate(product._id, {
                quantity: product.quantity + quantity
            });

        }

    } else {
        product = new Cart({
            userId: userId,
            productId: productId,
            quantity: quantity,
        });
        product.save();
    }
}

async function removefromCart(userId, productId) {
    let product = await Cart.findOneAndDelete({ userId: userId, productId: productId });

}

async function getCartItems(userId) {
    const products = await Cart.find({ userId: userId }).populate("productId");
    return products.map((x) => {
        return { quantity: x.quantity, product: x.productId }

    });
}
async function clearCart(userId) {
    await Cart.deleteMany({
        userId: userId,
    });
}

module.exports = { getCartItems, removefromCart, addToCart, clearCart }