export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    console.log("Order received:", data);

    res.status(200).json({
      message: "Order created successfully",
      orderId: "ORD" + Date.now()
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}