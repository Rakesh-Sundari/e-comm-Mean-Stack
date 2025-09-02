const Order = require("./../db/order");

async function addOrder(userId, orderModel) {
    console.log('Creating order for user:', userId, 'with data:', orderModel);
    let order = new Order({
        ...orderModel,
        userId: userId,
        status: "inprogress",
        date: new Date()
    });
    
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder._id);
    return savedOrder;
}


async function getCustomerOrders(userId) {
    let orders = await Order.find({ userId: userId });
    return orders.map((x) => x.toObject());
}

async function getOrders(){
     let orders = await Order.find();
    return orders.map((x) => x.toObject());
}
async function updateOrderStatus(id,status) {
    await Order.findByIdAndUpdate(id,{
        status:status,
    });
}

async function getUserOrders(userId) {
    return await getCustomerOrders(userId);
}

module.exports={addOrder,getCustomerOrders,getOrders,updateOrderStatus,getUserOrders}