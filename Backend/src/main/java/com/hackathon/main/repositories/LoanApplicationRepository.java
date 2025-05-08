package com.hackathon.main.repositories;
import com.hackathon.main.entities.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
}
