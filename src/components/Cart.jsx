import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import {currencyFormatter} from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

export default function Cart() {    
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotalAmount = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price;
    }, 0);
    function handleCloseCart() {
        userProgressCtx.hideCart();
    }
    function handleGoToCheckout() {
        userProgressCtx.showCheckout();
    }
    return (
    <Modal className="cart" open={userProgressCtx.progress === 'cart'} onClose={userProgressCtx.progress === 'cart' ? handleCloseCart : null}>
        <h2>Your Shopping Cart</h2>
        <ul>
            {cartCtx.items.map(item => (
                <CartItem key={item.id} 
                name={item.name} 
                quantity={item.quantity} 
                price={item.price} 
                onIncrease={() => cartCtx.addItem(item)}
                onDecrease={() => cartCtx.removeItem(item.id)}
                />
            ))}
        </ul>
        <p className="cart-total">{currencyFormatter.format(cartTotalAmount)}</p>
        <p className="modal-actions">
            <Button textOnly onClick={handleCloseCart}>Close</Button>
            {cartCtx.items.length > 0 && <Button onClick={handleGoToCheckout}>Go to Checkout</Button>}
        </p>
    </Modal>);
}