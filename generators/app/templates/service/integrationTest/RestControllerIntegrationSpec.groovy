package <%=packageName%>

import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.http.HttpStatus
import org.springframework.core.io.ClassPathResource
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import spock.lang.Unroll

import java.util.Collections;

<% imports && imports.forEach(function (importClassName, i) { %>import <%=modelPackageName %>.<%=importClassName %>
<% }) %>

public class <%=classname%>IntegrationSpec extends AbstractRestControllerIntegrationSpec {

    @Autowired
    private TestRestTemplate restTemplate;

    def HttpHeaders headers = new HttpHeaders();
    def HttpEntity entity

    def setup() {
        headers.clear()
    }

    def HttpEntity prepareEntity(def HttpEntity entity) {
        if (entity) {
            return entity;
        }

        return new HttpEntity<Void>(null, headers)
    }

    <%routes.forEach(function (route, i)  {%>
      <%route.operations.forEach(function (operation, i)
        {%>
    <% if (operation.produces) { %>@Unroll<% } %>
    def 'should return valid response from <%=operation.method%> <%=basePath%><%=operation.path%><% if (operation.produces) { %> with accepting: #produces<% } %>'() {
        given:
            <% if (operation.produces) { %>
            headers.setAccept(Arrays.asList(MediaType.parseMediaType(produces)))<% } %>
            <%if (operation.consumesString) { %>headers.setContentType(MediaType.parseMediaType('<%- operation.consumesString%>'))<%}%>
            <%operation.parameters && operation.parameters.forEach(function (param, i){%><%if (param.in === 'header') { %>headers.set('<%=param.name%>', 'val')<% } %>
            <%})%>

            <% if (operation.fileUploadField) { %>
            MultiValueMap<String, Object> multipartMap = new LinkedMultiValueMap<>()
            <%operation.parameters && operation.parameters.forEach(function (param, i){%><%if (param.in === 'formData') { %><% if (param.type === 'file') { %>multipartMap.add('<%=param.name%>', new ClassPathResource('application.yml'))<% }%><% } %>
            <%})%>
            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<MultiValueMap<String, Object>>(multipartMap, headers)
            <% } else {%>
            <%operation.parameters && operation.parameters.forEach(function (param, i){%><%if (param.in === 'body') { %>HttpEntity<<%=param.paramClass%>> entity = new HttpEntity<<%=param.paramClass%>>(<% if (param.paramContainer) { %>Collections.singletonList(<% } %><% if (['Integer', 'String', 'Long', 'Boolean', 'Float', 'Decimal'].indexOf(param.paramClass) === -1) { %><%=param.paramClass%>.<%=param.paramClass%>Builder.a<%=param.paramClass%>().build()<% } else { %><%=param.paramClass%>.valueOf("1")<% } %><% if (param.paramContainer) { %>)<% } %>, headers)<% } %>
            <%})%>
            <% } %>

        when:
        def ResponseEntity<<%-capitalize(operation.returnType)%>> responseEntity = restTemplate.exchange(
                        '<%=basePath%><% if (operation.pathForIntegrationTest) {%><%-operation.pathForIntegrationTest%><%} else {%><%=operation.path%><%}%>',
                        HttpMethod.<%=operation.method%>,
                        prepareEntity(entity),
                        <%if (operation.responseContainer) { %>new ParameterizedTypeReference<<%-capitalize(operation.returnType)%>>() {}<% } else { %><%-capitalize(operation.returnType)%><% } %>
                )
        then:
        responseEntity.statusCode.value() == <%-operation.successStatus%>.value()

        <% if (operation.produces) { %>
        where:
        produces << ['<%- operation.produces.join("', '")%>']<% } %>
    }
    <%})%>
  <%});%>
}
