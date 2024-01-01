package emsi.iir4.pathogene.domain;

import static org.assertj.core.api.Assertions.assertThat;

import emsi.iir4.pathogene.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MaladieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Maladie.class);
        Maladie maladie1 = new Maladie();
        maladie1.setId(1L);
        Maladie maladie2 = new Maladie();
        maladie2.setId(maladie1.getId());
        assertThat(maladie1).isEqualTo(maladie2);
        maladie2.setId(2L);
        assertThat(maladie1).isNotEqualTo(maladie2);
        maladie1.setId(null);
        assertThat(maladie1).isNotEqualTo(maladie2);
    }
}
