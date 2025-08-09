import sessionChecker from "~/lib/sessionPermission";
import notificationModel from "~/models/notification";
import orderModel from "~/models/order";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  console.log("query99: ", req.body);
  console.log("method: ", method);

  if (!(await sessionChecker(req, "order")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const id = req.query.id;
        const order = await orderModel.findById(id);
        if (order.new) {
          order.new = false;
          await order.save();
        }
        res.status(200).json({ success: true, order });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const id = req.query.id;
        if (req.body.courier) {
          await orderModel.findByIdAndUpdate(id, {
            courier: req.body.courier,
          });
          res.status(200).json({ success: true });
        }
        const _or = await orderModel.findByIdAndUpdate(id, {
          status: req.query.order_status,
          paymentStatus: req.query.payment_status,
        });
        let _msg = "";
        req.query.action === "payment"
          ? (_msg = `<p>Order (<a href="/dashboard/orders/${_or._id}" target="_blank">${_or.orderId}</a>) payment status changed to (${req.query.payment_status})</p>`)
          : (_msg = `<p>Order (<a href="/dashboard/orders/${_or._id}" target="_blank">${_or.orderId}</a>) status changed to (${req.query.order_status})</p>`);
        await notificationModel.create({ message: _msg });
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const id = req.query.id;

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing order ID" });
        }

        const order = await orderModel.findById(id);
        if (!order) {
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });
        }
        const courierData = req.body.courier;

        if (!courierData) {
          return res
            .status(400)
            .json({ success: false, message: "No courier data provided" });
        }
        order.courier = courierData;
        await order.save();

        res.status(200).json({
          success: true,
          message: "Courier updated successfully",
          // order: updatedOrder,
        });
      } catch (err) {
        console.error("Error updating order:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
