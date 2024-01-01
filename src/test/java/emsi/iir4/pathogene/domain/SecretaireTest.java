package emsi.iir4.pathogene.domain;

import static org.assertj.core.api.Assertions.assertThat;

import emsi.iir4.pathogene.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SecretaireTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Secretaire.class);
        Secretaire secretaire1 = new Secretaire();
        secretaire1.setId(1L);
        Secretaire secretaire2 = new Secretaire();
        secretaire2.setId(secretaire1.getId());
        assertThat(secretaire1).isEqualTo(secretaire2);
        secretaire2.setId(2L);
        assertThat(secretaire1).isNotEqualTo(secretaire2);
        secretaire1.setId(null);
        assertThat(secretaire1).isNotEqualTo(secretaire2);
    }
}
