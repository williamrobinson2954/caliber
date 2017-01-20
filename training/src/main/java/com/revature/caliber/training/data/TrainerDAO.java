package com.revature.caliber.training.data;

import java.util.List;

import com.revature.caliber.training.beans.Trainer;

/**
 * DAO interface for trainer object
 */
public interface TrainerDAO {

	/**
     * Creates new trainer
     * @param trainer trainer to create
     */
	void createTrainer(Trainer trainer);
	
	/**
	 * Gets a trainer by id
	 * @param id: id of the trainer
	 * @return: Trainer object
	 */
	Trainer getTrainer(Integer id);
	
	/**
	 * Gets a list of trainers by a name
	 * @param name: the name of the trainer(s)
	 * @return: a list of Trainer objects
	 */
	List<Trainer> getTrainer(String name);
	
	/**
	 * Gets a list of all trainers
	 * @return: a list of Trainer objects
	 */
	List<Trainer> getAllTrainers();
	
	/**
	 * Updates a trainer
	 * @param trainer: the trainer object to update
	 */
	void updateTrainer(Trainer trainer);
	
	/**
	 * Deletes a trainer
	 * @param trainer: the trainer object to delete
	 */
	void deleteTrainer(Trainer trainer);
}