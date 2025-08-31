package com.shop.controller;

import com.shop.model.Customer;
import com.shop.model.Order;
import com.shop.repository.OrderRepository;
import com.shop.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        // Check if customer exists by email
        Optional<Customer> existingCustomer = customerService.getCustomerByEmail(order.getCustomerEmail());
        
        Customer customer;
        if (existingCustomer.isPresent()) {
            // Customer exists, use existing customer
            customer = existingCustomer.get();
        } else {
            // Customer doesn't exist, create new customer
            customer = new Customer();
            customer.setName(order.getCustomerName());
            customer.setEmail(order.getCustomerEmail());
            customer.setPhone(order.getCustomerPhone());
            customer.setAddress(order.getShippingAddress());
            customer = customerService.saveCustomer(customer);
        }
        
        // Associate the customer with the order
        order.setCustomer(customer);
        
        // Set order date if not already set
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        
        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
