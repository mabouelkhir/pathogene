package emsi.iir4.pathogene.service.dto;

import emsi.iir4.pathogene.domain.Secretaire;
import emsi.iir4.pathogene.web.rest.vm.ManagedUserVM;

public class SecretaireUserDTO {

    Secretaire secretaire;

    ManagedUserVM user;

    //empty constructor
    public SecretaireUserDTO() {}

    //getter and setter
    public Secretaire getSecretaire() {
        return secretaire;
    }

    public void setSecretaire(Secretaire secretaire) {
        this.secretaire = secretaire;
    }

    public ManagedUserVM getUser() {
        return user;
    }

    public void setUser(ManagedUserVM user) {
        this.user = user;
    }
}
