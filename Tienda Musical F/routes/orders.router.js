ordersRouter.get("/", async (req, res) => {
    try {
        const orders = await listOrders(); // Obtén la lista de pedidos desde el servicio
        res.render("orders", { orders }); // Renderiza la vista 'orders.ejs'
    } catch (error) {
        console.error("Error en GET /orders:", error.message);
        res.status(500).send("Error al cargar los pedidos.");
    }
});
