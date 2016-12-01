package <%=packageName%>

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.web.context.WebApplicationContext
import spock.lang.Specification

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ContextConfiguration
class ApplicationIntegrationSpec extends Specification {

    @Autowired
    private WebApplicationContext context

    def "should boot up without errors"() {
        expect:
        context != null
    }
}
