import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SuccessState {
  orderNumber?: string;
  paymentStatus?: "pending" | "confirmed";
}

const OrderSuccess = () => {
  const { state } = useLocation();
  const successState = (state ?? {}) as SuccessState;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center bg-card border border-border p-8 md:p-12">
            <CheckCircle size={56} className="mx-auto text-primary mb-4" />
            <h1 className="font-display text-3xl font-semibold mb-3">Order Placed Successfully</h1>
            <p className="font-body text-muted-foreground mb-2">
              Thank you for shopping with Tiara Collections.
            </p>
            {successState.orderNumber ? (
              <p className="font-body text-base mb-2">
                Order ID: <span className="font-semibold">{successState.orderNumber}</span>
              </p>
            ) : null}
            <p className="font-body text-sm text-muted-foreground mb-8">
              Payment status: {successState.paymentStatus === "confirmed" ? "Confirmed" : "Payment Pending Verification"}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/orders" className="btn-shop text-center">
                Track My Order
              </Link>
              <Link to="/" className="btn-shop-outline text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
