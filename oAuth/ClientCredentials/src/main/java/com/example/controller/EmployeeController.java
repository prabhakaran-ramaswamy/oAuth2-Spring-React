package com.example.controller;

import com.example.entity.Employee;
import com.example.exception.NoRecordFoundException;
import com.example.service.EmployeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        if (employee.isEmpty()) {
            throw new NoRecordFoundException("No employee found with id: " + id);
        }
        return employee.get();
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        return employeeService.updateEmployee(id, employeeDetails).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }

    @GetMapping("/dob")
    public List<Employee> getEmployeesByDateOfBirthRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate end) {
        return employeeService.findByDateOfBirthBetween(start, end);
    }

    @GetMapping("/department/{department}")
    public List<Employee> getEmployeesByDepartment(@PathVariable String department) {
        return employeeService.findByDepartment(department);
    }

    @GetMapping("/search/name")
    public List<Employee> getEmployeesByNameContaining(@RequestParam("q") String name) {
        List<Employee> employees = employeeService.findByNameContainingIgnoreCase(name);
        if (employees == null || employees.isEmpty()) {
            throw new NoRecordFoundException("No employees found with name containing: " + name);
        }
        return employees;
    }

    @GetMapping("/search/email")
    public Employee getEmployeeByEmail(@RequestParam("email") String email) {
        return employeeService.findByEmail(email)
                .orElseThrow(() -> new NoRecordFoundException("No employee found with email: " + email));
    }

    @GetMapping("/department/{department}/dob")
    public List<Employee> getEmployeesByDepartmentAndDob(
            @PathVariable String department,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate end) {
        return employeeService.findByDepartmentAndDateOfBirthBetween(department, start, end);
    }

    @GetMapping("/salary")
    public List<Employee> getEmployeesBySalaryRange(
            @RequestParam Double minSalary,
            @RequestParam Double maxSalary) {
        return employeeService.getEmployeesBySalaryRange(minSalary, maxSalary);
    }

    @GetMapping("/joined-date")
    public List<Employee> getEmployeesByJoinedDateRange(
            @RequestParam("start") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate start,
            @RequestParam("end") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate end) {
        return employeeService.findByJoinedDateBetween(start, end);
    }
}
