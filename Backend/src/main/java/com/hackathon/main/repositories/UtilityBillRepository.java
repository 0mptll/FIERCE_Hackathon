package com.hackathon.main.repositories;

import com.hackathon.main.entities.UtilityBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UtilityBillRepository extends JpaRepository<UtilityBill, Long> {
    //  You can add custom query methods if needed, e.g.,
     List<UtilityBill> findByUserId(Long userId);
}
