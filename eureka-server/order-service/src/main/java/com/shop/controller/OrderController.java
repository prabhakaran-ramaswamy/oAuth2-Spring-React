package com.shop.controller;

import com.shop.model.Customer;
import com.shop.model.Order;
import com.shop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${customer.service.url}")
    private String customerServiceUrl;

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
        try {
            // Check if customer exists by email using RestTemplate
            Customer existingCustomer = null;
            try {
                ResponseEntity<Customer> response = restTemplate.getForEntity(
                    customerServiceUrl + "/customers/email/" + order.getCustomerEmail(),
                    Customer.class
                );
                if (response.getStatusCode().is2xxSuccessful()) {
                    existingCustomer = response.getBody();
                }
            } catch (RestClientException e) {
                // Customer not found, will create new one
                existingCustomer = null;
            }
            
            Customer customer;
            if (existingCustomer != null) {
                // Customer exists, use existing customer
                customer = existingCustomer;
            } else {
                // Customer doesn't exist, create new customer via API
                customer = new Customer();
                customer.setName(order.getCustomerName());
                customer.setEmail(order.getCustomerEmail());
                customer.setPhone(order.getCustomerPhone());
                customer.setAddress(order.getShippingAddress());
                
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Customer> request = new HttpEntity<>(customer, headers);
                
                ResponseEntity<Customer> createResponse = restTemplate.postForEntity(
                    customerServiceUrl + "/customers",
                    request,
                    Customer.class
                );
                
                if (createResponse.getStatusCode().is2xxSuccessful()) {
                    customer = createResponse.getBody();
                } else {
                    throw new RuntimeException("Failed to create customer");
                }
            }
            
            // Associate the customer with the order
            order.setCustomer(customer);
            
            // Set order date if not already set
            if (order.getOrderDate() == null) {
                order.setOrderDate(LocalDateTime.now());
            }
            
            // Calculate total if not set or if items are present
            if (order.getTotal() == null || order.getTotal() == 0.0) {
                order.calculateTotal();
            }
            
            // Set default status if not provided
            if (order.getStatus() == null || order.getStatus().isEmpty()) {
                order.setStatus("PENDING");
            }
            
            return orderRepository.save(order);
            
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to communicate with customer service: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
