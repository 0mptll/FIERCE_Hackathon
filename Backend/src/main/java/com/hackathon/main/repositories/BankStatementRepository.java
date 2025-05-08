package com.hackathon.main.repositories;

import com.hackathon.main.entities.BankStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface BankStatementRepository extends JpaRepository<BankStatement, Long> {
      List<BankStatement> findByUserId(Long userId);
}

