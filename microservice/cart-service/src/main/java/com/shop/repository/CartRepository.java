package com.shop.repository;

import com.shop.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findBySessionId(String sessionId);
    
    Optional<CartItem> findBySessionIdAndProductId(String sessionId, Long productId);
    
    @Query("SELECT SUM(c.quantity) FROM CartItem c WHERE c.sessionId = :sessionId")
    Integer countItemsBySessionId(@Param("sessionId") String sessionId);
    
    void deleteBySessionId(String sessionId);
}