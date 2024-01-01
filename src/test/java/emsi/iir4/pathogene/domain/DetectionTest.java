package emsi.iir4.pathogene.domain;

import static org.assertj.core.api.Assertions.assertThat;

import emsi.iir4.pathogene.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DetectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Detection.class);
        Detection detection1 = new Detection();
        detection1.setId(1L);
        Detection detection2 = new Detection();
        detection2.setId(detection1.getId());
        assertThat(detection1).isEqualTo(detection2);
        detection2.setId(2L);
        assertThat(detection1).isNotEqualTo(detection2);
        detection1.setId(null);
        assertThat(detection1).isNotEqualTo(detection2);
    }
}
