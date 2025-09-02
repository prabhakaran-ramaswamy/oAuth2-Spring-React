package com.example.service;

import com.example.entity.Employee;
import com.example.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Optional<Employee> updateEmployee(Long id, Employee employeeDetails) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setName(employeeDetails.getName());
            employee.setEmail(employeeDetails.getEmail());
            employee.setDepartment(employeeDetails.getDepartment());
            return employeeRepository.save(employee);
        });
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public List<Employee> findByDateOfBirthBetween(LocalDate start, LocalDate end) {
        return employeeRepository.findByDateOfBirthBetween(start, end);
    }

    public List<Employee> findByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    public List<Employee> findByNameContainingIgnoreCase(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name);
    }

    public java.util.Optional<Employee> findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public List<Employee> findByDepartmentAndDateOfBirthBetween(String department, java.time.LocalDate start, java.time.LocalDate end) {
        return employeeRepository.findByDepartmentAndDateOfBirthBetween(department, start, end);
    }

    public List<Employee> getEmployeesBySalaryRange(Double minSalary, Double maxSalary) {
        return employeeRepository.findBySalaryBetween(minSalary, maxSalary);
    }

    public List<Employee> findByJoinedDateBetween(java.time.LocalDate start, java.time.LocalDate end) {
        return employeeRepository.findByJoinedDateBetween(start, end);
    }
}
