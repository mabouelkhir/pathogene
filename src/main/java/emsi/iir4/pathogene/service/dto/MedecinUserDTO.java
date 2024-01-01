package emsi.iir4.pathogene.service.dto;

import emsi.iir4.pathogene.domain.Medecin;
import emsi.iir4.pathogene.web.rest.vm.ManagedUserVM;

public class MedecinUserDTO {

    private Medecin medecin;
    private ManagedUserVM user;

    //empty constructor
    public MedecinUserDTO() {}

    //getter and setter
    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public ManagedUserVM getUser() {
        return user;
    }

    public void setUser(ManagedUserVM user) {
        this.user = user;
    }
}
