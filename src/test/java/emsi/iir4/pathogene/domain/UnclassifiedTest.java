package emsi.iir4.pathogene.domain;

import static org.assertj.core.api.Assertions.assertThat;

import emsi.iir4.pathogene.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UnclassifiedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Unclassified.class);
        Unclassified unclassified1 = new Unclassified();
        unclassified1.setId(1L);
        Unclassified unclassified2 = new Unclassified();
        unclassified2.setId(unclassified1.getId());
        assertThat(unclassified1).isEqualTo(unclassified2);
        unclassified2.setId(2L);
        assertThat(unclassified1).isNotEqualTo(unclassified2);
        unclassified1.setId(null);
        assertThat(unclassified1).isNotEqualTo(unclassified2);
    }
}
