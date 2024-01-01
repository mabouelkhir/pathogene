package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.config.Constants;
import emsi.iir4.pathogene.domain.Medecin;
import emsi.iir4.pathogene.domain.Patient;
import emsi.iir4.pathogene.domain.Secretaire;
import emsi.iir4.pathogene.domain.User;
import emsi.iir4.pathogene.repository.MedecinRepository;
import emsi.iir4.pathogene.repository.PatientRepository;
import emsi.iir4.pathogene.repository.SecretaireRepository;
import emsi.iir4.pathogene.repository.UserRepository;
import emsi.iir4.pathogene.security.AuthoritiesConstants;
import emsi.iir4.pathogene.service.MailService;
import emsi.iir4.pathogene.service.UserService;
import emsi.iir4.pathogene.service.dto.AdminUserDTO;
import emsi.iir4.pathogene.service.dto.MedecinUserDTO;
import emsi.iir4.pathogene.service.dto.PatientUserDTO;
import emsi.iir4.pathogene.service.dto.SecretaireUserDTO;
import emsi.iir4.pathogene.web.rest.errors.BadRequestAlertException;
import emsi.iir4.pathogene.web.rest.errors.EmailAlreadyUsedException;
import emsi.iir4.pathogene.web.rest.errors.LoginAlreadyUsedException;
import emsi.iir4.pathogene.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing users.
 * <p>
 * This class accesses the {@link emsi.iir4.pathogene.domain.User} entity, and needs to fetch its collection of authorities.
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this case.
 */
@RestController
@RequestMapping("/api/admin")
public class UserResource {

    private static final List<String> ALLOWED_ORDERED_PROPERTIES = Collections.unmodifiableList(
        Arrays.asList(
            "id",
            "login",
            "firstName",
            "lastName",
            "email",
            "activated",
            "langKey",
            "createdBy",
            "createdDate",
            "lastModifiedBy",
            "lastModifiedDate"
        )
    );

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final UserRepository userRepository;

    private final MedecinRepository medecinRepository;

    private final PatientRepository patientRepository;

    private final SecretaireRepository secretaireRepository;

    private final AccountResource accountResource;

    private final MailService mailService;

    public UserResource(
        UserService userService,
        UserRepository userRepository,
        MailService mailService,
        MedecinRepository medecinRepository,
        PatientRepository patientRepository,
        SecretaireRepository secretaireRepository,
        AccountResource accountResource
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.medecinRepository = medecinRepository;
        this.patientRepository = patientRepository;
        this.secretaireRepository = secretaireRepository;
        this.accountResource = accountResource;
    }

    @PostMapping("medecin/register")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Medecin registerPatient(@Valid @RequestBody MedecinUserDTO medecindto) {
        log.debug("REST request to save Medecin : {}", medecindto);
        Medecin medecin = medecindto.getMedecin();
        ManagedUserVM puser = medecindto.getUser();

        if (medecin.getId() != null) {
            throw new BadRequestAlertException("A new Medecin cannot already have an ID", "Medecin", "idexists");
        }
        puser.setAuthorities(new HashSet<>());
        puser.getAuthorities().add(AuthoritiesConstants.MEDECIN);

        User user = userService.createAdministeredUser(puser);
        medecin.setUser(user);
        medecin.setCode("MED-" + UUID.randomUUID().toString());
        return medecinRepository.save(medecin);
    }

    @PostMapping("patient/register")
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.SECRETAIRE + "','" + AuthoritiesConstants.ADMIN + "')")
    public Patient registerPatient(@Valid @RequestBody PatientUserDTO patientUserDTO) {
        log.debug("REST request to save Patient : {}", patientUserDTO);
        Patient patient = patientUserDTO.getPatient();
        ManagedUserVM puser = patientUserDTO.getUser();
        if (patient.getId() != null) {
            throw new BadRequestAlertException("A new Patient cannot already have an ID", "Patient", "idexists");
        }
        puser.setAuthorities(new HashSet<>());
        puser.getAuthorities().add(AuthoritiesConstants.PATIENT);
        User user = userService.createAdministeredUser(puser);
        patient.setUser(user);
        patient.setCode("PAT-" + UUID.randomUUID().toString());
        return patientRepository.save(patient);
    }

    @PostMapping("secretaire/register")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Secretaire registerPatient(@Valid @RequestBody SecretaireUserDTO secretaireUserDTO) {
        log.debug("REST request to save Secretaire : {}", secretaireUserDTO);
        Secretaire secretaire = secretaireUserDTO.getSecretaire();
        ManagedUserVM puser = secretaireUserDTO.getUser();
        if (secretaire.getId() != null) {
            throw new BadRequestAlertException("A new Secretaire cannot already have an ID", "Secretaire", "idexists");
        }
        puser.setAuthorities(new HashSet<>());
        puser.getAuthorities().add(AuthoritiesConstants.SECRETAIRE);
        User user = userService.createAdministeredUser(puser);
        secretaire.setUser(user);
        secretaire.setCode("SEC-" + UUID.randomUUID().toString());
        return secretaireRepository.save(secretaire);
    }

    /**
     * {@code POST  /admin/users}  : Creates a new user.
     * <p>
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     *
     * @param userDTO the user to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new user, or with status {@code 400 (Bad Request)} if the login or email is already in use.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the login or email is already in use.
     */
    @PostMapping("/users")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody ManagedUserVM userDTO) throws URISyntaxException {
        log.debug("REST request to save User : {}", userDTO);

        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
            // Lowercase the user login before comparing with database
        } else if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            User newUser = userService.createUser(userDTO);
            mailService.sendCreationEmail(newUser);
            return ResponseEntity
                .created(new URI("/api/admin/users/" + newUser.getLogin()))
                .headers(HeaderUtil.createAlert(applicationName, "userManagement.created", newUser.getLogin()))
                .body(newUser);
        }
    }

    /**
     * {@code PUT /admin/users} : Updates an existing User.
     *
     * @param userDTO the user to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated user.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already in use.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already in use.
     */
    @PutMapping("/users")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> updateUser(@Valid @RequestBody AdminUserDTO userDTO) {
        log.debug("REST request to update User : {}", userDTO);
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new LoginAlreadyUsedException();
        }
        Optional<AdminUserDTO> updatedUser = userService.updateUser(userDTO);

        return ResponseUtil.wrapOrNotFound(
            updatedUser,
            HeaderUtil.createAlert(applicationName, "userManagement.updated", userDTO.getLogin())
        );
    }

    /**
     * {@code GET /admin/users} : get all users with all the details - calling this are only allowed for the administrators.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.SECRETAIRE + "','" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all User for an admin");
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }
        final Page<AdminUserDTO> page;
        //if current account is a SECRETAIRE, he can only see his patients
        if (accountResource.getAccount().getAuthorities().contains(new SimpleGrantedAuthority(AuthoritiesConstants.SECRETAIRE))) {
            page = userService.getAllSecPatients(pageable, accountResource.getAccount().getId());
        } else {
            page = userService.getAllManagedUsers(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    private boolean onlyContainsAllowedProperties(Pageable pageable) {
        return pageable.getSort().stream().map(Sort.Order::getProperty).allMatch(ALLOWED_ORDERED_PROPERTIES::contains);
    }

    /**
     * {@code GET /admin/users/:login} : get the "login" user.
     *
     * @param login the login of the user to find.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the "login" user, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/users/{login}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        log.debug("REST request to get User : {}", login);
        return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(login).map(AdminUserDTO::new));
    }

    @GetMapping("/users/id/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable Long id) {
        log.debug("REST request to get User : {}", id);
        return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesById(id).map(AdminUserDTO::new));
    }

    /**
     * {@code DELETE /admin/users/:login} : delete the "login" User.
     *
     * @param login the login of the user to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users/{login}")
    @PreAuthorize("hasAnyAuthority('" + AuthoritiesConstants.SECRETAIRE + "','" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<Void> deleteUser(@PathVariable @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        if (accountResource.getAccount().getAuthorities().contains(new SimpleGrantedAuthority(AuthoritiesConstants.SECRETAIRE))) {
            log.debug("REST request to delete User : {}", login);

            Optional<User> optionalUser = userService.getUserWithAuthoritiesByLogin(login);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                // Vérifier si l'utilisateur n'est pas un PATIENT avant de le supprimer
                if (!user.getAuthorities().contains(new SimpleGrantedAuthority(AuthoritiesConstants.PATIENT))) {
                    return ResponseEntity.badRequest().build();
                }
            } else {
                // L'utilisateur n'a pas été trouvé
                return ResponseEntity.notFound().build();
            }
        }
        log.debug("REST request to delete User: {}", login);
        userService.deleteUser(login);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createAlert(applicationName, "A user is deleted with identifier " + login, login))
            .build();
    }
}
