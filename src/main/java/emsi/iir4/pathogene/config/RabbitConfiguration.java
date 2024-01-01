package emsi.iir4.pathogene.config;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfiguration {

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange("healthcare.rpc");
    }
}
