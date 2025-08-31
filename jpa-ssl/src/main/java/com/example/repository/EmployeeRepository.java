package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Employee;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDateOfBirthBetween(LocalDate start, LocalDate end);

    List<Employee> findByDepartment(String department);

    List<Employee> findByNameContainingIgnoreCase(String name);

    java.util.Optional<Employee> findByEmail(String email);

    List<Employee> findByDepartmentAndDateOfBirthBetween(String department, java.time.LocalDate start, java.time.LocalDate end);

    List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary);

    List<Employee> findByJoinedDateBetween(LocalDate start, LocalDate end);
}