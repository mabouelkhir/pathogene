package emsi.iir4.pathogene.service.dto;

import emsi.iir4.pathogene.domain.Patient;
import emsi.iir4.pathogene.web.rest.vm.ManagedUserVM;

public class PatientUserDTO {

    Patient patient;
    ManagedUserVM user;

    //empty constructor
    public PatientUserDTO() {}

    //getter and setter
    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public ManagedUserVM getUser() {
        return user;
    }

    public void setUser(ManagedUserVM user) {
        this.user = user;
    }
}
