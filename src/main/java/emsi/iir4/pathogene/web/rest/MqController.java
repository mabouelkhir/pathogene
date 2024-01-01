package emsi.iir4.pathogene.web.rest;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mq")
public class MqController {

    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange exchange;

    @PostMapping("/analyze")
    public String send(@RequestParam byte[] photo, @RequestParam String name) {
        // BigInteger.valueOf(id).toByteArray()
        System.out.println(" [x] Requesting classification.....");
        System.out.println("from :" + exchange.getName());
        System.out.println("name :" + name);
        byte[] response;
        switch (name) {
            case "brain Cancer":
                response = (byte[]) template.convertSendAndReceive("", "rpc_brain", photo);
                break;
            case "Rethinopathy":
                response = (byte[]) template.convertSendAndReceive("", "rpc_retino", photo);
                break;
            case "Pneumonia":
                response = (byte[]) template.convertSendAndReceive("", "rpc_pneumonia", photo);
                break;
            case "Breast Cancer":
                response = (byte[]) template.convertSendAndReceive("", "rpc_breast", photo);
                break;
            case "Keratocone":
                response = (byte[]) template.convertSendAndReceive("", "rpc_keratocone", photo);
                break;
            default:
                // Handle unknown disease name
                return "Unknown disease: " + name;
        }
        String oracle;
        if (response != null) oracle = new String(response); else oracle = new String(new byte[0]);
        System.out.println("[x]" + oracle);
        return oracle;
    }

    @PostMapping("/ping")
    public String ping() {
        byte[] response = (byte[]) template.convertSendAndReceive("", "rpc_queue", "");
        return new String(response);
    }
}
