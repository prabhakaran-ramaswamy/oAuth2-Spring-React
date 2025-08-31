package com.shop.service;

import com.shop.model.CartItem;
import com.shop.model.Product;
import com.shop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    @Value("${product.service.api.path}")
    private String productServiceApiPath;

    public List<CartItem> getCartItems(String sessionId) {
        return cartRepository.findBySessionId(sessionId);
    }

    public CartItem addItemToCart(String sessionId, Long productId, Integer quantity) {
        try {
            Product product = restTemplate.getForObject(
                productServiceUrl + productServiceApiPath + "/" + productId,
                Product.class
            );

            if (product == null) {
                throw new RuntimeException("Product not found");
            }

            Optional<CartItem> existingItem = cartRepository.findBySessionIdAndProductId(sessionId, productId);

            if (existingItem.isPresent()) {
                // Update existing item
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + quantity);
                return cartRepository.save(item);
            } else {
                // Create new item
                CartItem newItem = new CartItem(product, quantity, sessionId);
                return cartRepository.save(newItem);
            }
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch product details: " + e.getMessage());
        }
    }

    public CartItem updateCartItem(Long itemId, Integer quantity) {
        Optional<CartItem> itemOpt = cartRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Cart item not found");
        }

        CartItem item = itemOpt.get();
        if (quantity <= 0) {
            cartRepository.delete(item);
            return null;
        } else {
            item.setQuantity(quantity);
            return cartRepository.save(item);
        }
    }

    public void removeCartItem(Long itemId) {
        cartRepository.deleteById(itemId);
    }

    public void clearCart(String sessionId) {
        cartRepository.deleteBySessionId(sessionId);
    }

    public Integer getCartItemCount(String sessionId) {
        Integer count = cartRepository.countItemsBySessionId(sessionId);
        return count != null ? count : 0;
    }
}