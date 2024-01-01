package emsi.iir4.pathogene.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";
    public static final String PATIENT = "PATIENT";
    public static final String MEDECIN = "MEDECIN";
    public static final String SECRETAIRE = "SECRETAIRE";

    private AuthoritiesConstants() {}
}
