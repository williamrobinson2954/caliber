package com.revature.caliber.training.service.implementations;

import com.revature.caliber.training.beans.Trainee;
import com.revature.caliber.training.data.Facade;
import com.revature.caliber.training.service.TraineeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by illyasviel on 1/18/17.
 */
@Component
public class TraineeServiceImplementation implements TraineeService {

    Facade facade;
    @Autowired
    public void setFacade(Facade facade) { this.facade = facade; }

    //trainee (just delegation, no business logic)
    public void createTrainee(Trainee trainee){ facade.createTrainee(trainee); }
    public void updateTrainee(Trainee trainee){ facade.updateTrainee(trainee); }
    public Trainee getTrainee(Integer id){ return facade.getTrainee(id); }
    public Trainee getTrainee(String name){ return facade.getTrainee(name); }
    public List<Trainee> getTraineesInBatch(Integer batchId){ return facade.getTraineesInBatch(batchId); }
    public void deleteTrainee(Trainee trainee){ facade.deleteTrainee(trainee); }
    //end of trainee
}