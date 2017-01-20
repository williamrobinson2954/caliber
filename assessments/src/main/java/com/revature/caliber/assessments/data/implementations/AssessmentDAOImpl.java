package com.revature.caliber.assessments.data.implementations;

import com.revature.caliber.assessments.beans.Assessment;
import com.revature.caliber.assessments.data.AssessmentDAO;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Repository(value = "assessmentDAO")
public class AssessmentDAOImpl implements AssessmentDAO {

    private SessionFactory sessionFactory;

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

//    Get
    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    public Assessment getById(long id) {
        return (Assessment) sessionFactory.getCurrentSession().get(Assessment.class, id);
    }

    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    @SuppressWarnings("unchecked")
    public Set<Assessment> getAll() {
        return new HashSet<>(
                sessionFactory.getCurrentSession()
                        .createCriteria(Assessment.class).list());
    }

/*   
 * 	TODO reconsider how to approach this implementation.
 * 		 data resides in another service, so you cannot query this way
 *  @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    @SuppressWarnings("unchecked")
    public Set<Assessment> getByTrainerId(long id) {
        return new HashSet<>(
                sessionFactory.getCurrentSession()
                        .createCriteria(Assessment.class)
                        .add(Restrictions.eq("trainer", id)).list());
    }*/

    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    @SuppressWarnings("unchecked")
    public Set<Assessment> getByWeekId(long id) {
        return new HashSet<>(
                sessionFactory.getCurrentSession()
                        .createCriteria(Assessment.class)
                        .add(Restrictions.eq("week", id)).list());
    }

    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    @SuppressWarnings("unchecked")
    public Set<Assessment> getByBatchId(int id) {
        return new HashSet<>(
                sessionFactory.getCurrentSession()
                        .createCriteria(Assessment.class)
                        .add(Restrictions.eq("batch", id)).list());
    }

//    Create
    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    public void insert(Assessment assessment) {
        sessionFactory.getCurrentSession().save(assessment);
    }

//    Update
    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    public void update(Assessment assessment) {
        sessionFactory.getCurrentSession().update(assessment);

    }

//    Delete
    @Override
    @Transactional(isolation=Isolation.READ_COMMITTED, rollbackFor=Exception.class, propagation=Propagation.REQUIRED)
    public void delete(Assessment assessment) {
        sessionFactory.getCurrentSession().delete(assessment);
    }
}