package com.shop.controller;

import com.shop.model.CartItem;
import com.shop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    private String getSessionId(HttpServletRequest request) {
        String sessionId = request.getSession().getId();
        return sessionId;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        List<CartItem> cartItems = cartService.getCartItems(sessionId);
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCartCount(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        Integer count = cartService.getCartItemCount(sessionId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping("/items")
    public ResponseEntity<CartItem> addItem(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {
        String sessionId = getSessionId(httpRequest);
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        
        CartItem cartItem = cartService.addItemToCart(sessionId, productId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItem> updateItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request) {
        Integer quantity = request.get("quantity");
        CartItem updatedItem = cartService.updateCartItem(itemId, quantity);
        
        if (updatedItem == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartService.removeCartItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        cartService.clearCart(sessionId);
        return ResponseEntity.noContent().build();
    }
}