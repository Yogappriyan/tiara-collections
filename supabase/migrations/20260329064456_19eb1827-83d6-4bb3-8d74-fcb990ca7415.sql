-- Ensure product stock is reduced automatically when order items are created
-- This uses existing security-definer function public.reduce_stock_on_order()

DROP TRIGGER IF EXISTS trg_reduce_stock_on_order ON public.order_items;

CREATE TRIGGER trg_reduce_stock_on_order
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.reduce_stock_on_order();