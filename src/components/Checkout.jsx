import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import {currencyFormatter} from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig);

    const cartTotalAmount = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price;
    }, 0);

    function handleCloseCheckout() {
        userProgressCtx.hideCheckout();
    }
    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        }));
    }
    let actions = (
    <>
        <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
        <Button>Submit Order</Button>
    </>);
    if(isSending) {
        actions = <span>Sending order data...</span>;
    }
    if(data && !error) {
        return (
            <Modal className="checkout" open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCheckout}>
                <h2>Order Successful!</h2>
                <p>Your order has been placed successfully.</p>
                <p>We will send you a confirmation email shortly.</p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Close</Button>
                </p>
            </Modal>
        );
    }
    return (
        <Modal className="checkout" open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCheckout}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotalAmount)}</p>
                <Input label="Full Name" type="text" id="name" />
                <Input label="Email Address" type="email" id="email" />
                <Input label="Street" type="text" id="street" />
                 <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" />
                    <Input label="City" type="text" id="city" />
                </div>
                {error && <Error title="Failed to submit order" message={error} />}
                <p className="modal-actions">{actions}</p>
            </form>
        </Modal>
    );
}