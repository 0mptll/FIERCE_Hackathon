package com.hackathon.main.services;
import com.hackathon.main.entities.LoanApplication;
import com.hackathon.main.repositories.LoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class LoanApplicationService {
   @Autowired
   private LoanApplicationRepository repository;
   public LoanApplication submitApplication(LoanApplication application) {
       return repository.save(application);
   }
}
