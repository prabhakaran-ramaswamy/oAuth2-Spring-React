import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for typed Redux usage
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Cart-specific selectors
export const useCart = () => useAppSelector((state) => state.cart);
export const useCartItems = () => useAppSelector((state) => state.cart.items);
export const useCartCount = () => useAppSelector((state) => state.cart.count);
export const useCartLoading = () => useAppSelector((state) => state.cart.loading);
export const useCartError = () => useAppSelector((state) => state.cart.error);
export const useAddingToCart = () => useAppSelector((state) => state.cart.addingToCart);
export const useUpdatingItem = () => useAppSelector((state) => state.cart.updatingItem);
